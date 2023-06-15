// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "./interfaces/INFTPoolRewardManager.sol";

contract RewardManager is AccessControlUpgradeable, INFTPoolRewardManager {
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    struct RewardToken {
        uint256 sharesPerSecond;
        uint256 accTokenPerShare;
        uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // To allow outside entities like the pool factory to add pools
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    address public treasury;

    // List of active pools
    EnumerableSetUpgradeable.AddressSet private _pools;

    // pool => list of reward token addresses
    mapping(address => EnumerableSetUpgradeable.AddressSet) private _poolRewardAddresses;
    // pool => token => info
    mapping(address => mapping(address => RewardToken)) private _poolRewardTokens;

    // per token reward debt for each NFT position for a pool
    // pool => tokenId => token => debt
    mapping(address => mapping(uint256 => mapping(address => uint256))) public positionRewardDebts;

    // accounts approved to add tokens to particular pools (Eg. other projects owner/operators)
    mapping(address => EnumerableSetUpgradeable.AddressSet) private _approvedForPool;

    event PoolAdded(address nftPoolAddress);
    event RewardTokenAdded(address indexed nftPoolAddress, address token, uint256 sharesPerSecond);
    event RewardTokenUpdated(address indexed nftPoolAddress, address token, uint256 sharesPerSecond);
    event RewardTokenRemoved(address indexed nftPoolAddress, address token);
    event RewardTokenHarvested(address indexed nftPoolAddress, address token, uint256 amount, uint256 tokenId);

    event ApprovedForPool(address nftPoolAddress, address account);
    event UnapprovedForPool(address nftPoolAddress, address account);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    modifier validatePool(address nftPoolAddress) {
        require(nftPoolAddress != address(0), "Pool not provided");
        require(_pools.contains(nftPoolAddress), "Pool not added");
        _;
    }

    modifier onlyPool() {
        require(_pools.contains(msg.sender), "Only pool");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _treasury) public initializer {
        require(_treasury != address(0), "Treasury not provided");

        __AccessControl_init();

        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, _treasury);
        _grantRole(OPERATOR_ROLE, _treasury);
        _grantRole(ADMIN_ROLE, _treasury);
    }

    // ==================================== VIEW ====================================== //

    function getPoolCount() public view returns (uint256) {
        return _pools.length();
    }

    /// @dev This has potential to become too large for calls. Have to use indexed based version then
    function getPoolAddresses() external view returns (address[] memory) {
        return _pools.values();
    }

    function getPoolAddressByIndex(uint256 index) external view returns (address) {
        if (index >= _pools.length()) return address(0);

        return _pools.at(index);
    }

    function getPoolRewardCount(address nftPoolAddress) public view returns (uint256) {
        return _poolRewardAddresses[nftPoolAddress].length();
    }

    function getPoolRewardTokenInfo(address nftPoolAddress, address token) external view returns (RewardToken memory) {
        return _poolRewardTokens[nftPoolAddress][token];
    }

    function getPoolTokenOperators(address nftPoolAddress) external view returns (address[] memory) {
        return _approvedForPool[nftPoolAddress].values();
    }

    // ==================================== ONLY POOL ====================================== //

    /**
     * @dev Get pending rewards for a position
     * Only callable by pool
     */
    function pendingAdditionalRewards(
        uint256 tokenId,
        uint256 positionAmountMultiplied,
        uint256 lpSupplyWithMultiplier,
        uint256 lastRewardTime
    ) external view onlyPool returns (address[] memory tokens, uint256[] memory rewardAmounts) {
        uint256 currentRewardTokenCount = getPoolRewardCount(msg.sender);
        tokens = new address[](currentRewardTokenCount);
        rewardAmounts = new uint256[](currentRewardTokenCount);

        if (currentRewardTokenCount == 0) {
            return (tokens, rewardAmounts);
        }

        // Stack too deep
        RewardToken memory currentReward;
        uint256 timeSinceLastReward = block.timestamp - lastRewardTime;
        uint256 positionAmount = positionAmountMultiplied;
        uint256 positionTokenId = tokenId;
        address tokenAddress;
        uint256 currentAccTokenPerShare;

        for (uint256 i = 0; i < currentRewardTokenCount; ) {
            tokenAddress = _poolRewardAddresses[msg.sender].at(i);
            tokens[i] = tokenAddress;

            currentReward = _poolRewardTokens[msg.sender][tokenAddress];
            currentAccTokenPerShare = currentReward.accTokenPerShare;

            if (block.timestamp > lastRewardTime && lpSupplyWithMultiplier > 0) {
                // build up would be accumulated amount at this time
                currentAccTokenPerShare +=
                    (timeSinceLastReward * currentReward.sharesPerSecond * currentReward.PRECISION_FACTOR) /
                    lpSupplyWithMultiplier;

                rewardAmounts[i] =
                    (positionAmount * currentAccTokenPerShare) /
                    currentReward.PRECISION_FACTOR -
                    positionRewardDebts[msg.sender][positionTokenId][tokenAddress];
            } else {
                rewardAmounts[i] = 0;
            }

            unchecked {
                ++i;
            }
        }
    }

    function updatePositionRewardDebts(uint256 positionAmountMultiplied, uint256 tokenId) external onlyPool {
        uint256 currentRewardCount = getPoolRewardCount(msg.sender);

        if (currentRewardCount == 0) return;

        RewardToken memory currentReward;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; ) {
            tokenAddress = _poolRewardAddresses[msg.sender].at(i);
            currentReward = _poolRewardTokens[msg.sender][tokenAddress];

            // accTokenPerShare should have already been updated as needed for this is run
            positionRewardDebts[msg.sender][tokenId][tokenAddress] =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR;

            unchecked {
                ++i;
            }
        }
    }

    function updateRewardsPerShare(uint256 lpSupplyMultiplied, uint256 lastRewardTime) external onlyPool {
        uint256 currentRewardCount = getPoolRewardCount(msg.sender);

        if (currentRewardCount == 0 || lpSupplyMultiplied == 0) return;

        RewardToken storage reward;
        uint256 currentDuration = block.timestamp - lastRewardTime;
        uint256 rewardAmountForDuration;
        uint256 accTokenPerShare;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; i++) {
            tokenAddress = _poolRewardAddresses[msg.sender].at(i);
            reward = _poolRewardTokens[msg.sender][tokenAddress];

            rewardAmountForDuration = currentDuration * reward.sharesPerSecond;
            accTokenPerShare = (rewardAmountForDuration * reward.PRECISION_FACTOR) / lpSupplyMultiplied;

            reward.accTokenPerShare += accTokenPerShare;
        }
    }

    function harvestAdditionalRewards(
        uint256 positionAmountMultiplied,
        address recipient,
        uint256 tokenId
    ) external onlyPool {
        uint256 currentRewardCount = getPoolRewardCount(msg.sender);

        if (currentRewardCount == 0) return;

        require(recipient != address(0), "RewardManager: Zero address recipient");

        RewardToken memory currentReward;
        uint256 pendingAmount;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; ) {
            tokenAddress = _poolRewardAddresses[msg.sender].at(i);
            currentReward = _poolRewardTokens[msg.sender][tokenAddress];

            pendingAmount =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR -
                positionRewardDebts[msg.sender][tokenId][tokenAddress];

            // update debt for current position amount and accPer
            positionRewardDebts[msg.sender][tokenId][tokenAddress] =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR;

            if (pendingAmount > 0) {
                emit RewardTokenHarvested(msg.sender, tokenAddress, pendingAmount, tokenId);
                _safeRewardsTransfer(tokenAddress, recipient, pendingAmount);
            }

            unchecked {
                ++i;
            }
        }
    }

    // ==================================== ADMIN ====================================== //

    function addPool(address nftPoolAddress) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender),
            "RewardManager: Not an operator"
        );
        require(!_pools.contains(nftPoolAddress), "RewardManager: Pool already added");

        _pools.add(nftPoolAddress);
        emit PoolAdded(nftPoolAddress);
    }

    /**
     * @dev To allow other projects owner/operators the ability to add tokens for pool.
     * Factory pool creation is permissionless, and all pools are added here at creation time.
     * However we do not want just anyone to be able to add any random token to any pool.
     * So this way projects can be allowed to manage their pool(s) rewards after we approve once.
     */
    function addApprovedForPool(
        address nftPoolAddress,
        address account
    ) external validatePool(nftPoolAddress) onlyAdmin {
        require(account != address(0), "RewardManager: Account not provided");
        require(!_approvedForPool[nftPoolAddress].contains(account), "RewardManager: Account already added");

        _approvedForPool[nftPoolAddress].add(account);
        emit ApprovedForPool(nftPoolAddress, account);
    }

    function unapproveForPool(address nftPoolAddress, address account) external validatePool(nftPoolAddress) onlyAdmin {
        require(account != address(0), "RewardManager: Account not provided");
        require(_approvedForPool[nftPoolAddress].contains(account), "RewardManager: Account not added");

        _approvedForPool[nftPoolAddress].remove(account);
        emit UnapprovedForPool(nftPoolAddress, account);
    }

    function addRewardToken(
        address nftPoolAddress,
        address tokenAddress,
        uint256 sharesPerSecond
    ) external validatePool(nftPoolAddress) {
        _checkIsPoolTokenOperator(nftPoolAddress);
        require(tokenAddress != address(0), "Token not provided");
        require(!_poolRewardAddresses[nftPoolAddress].contains(tokenAddress), "Token already added for pool");

        IERC20MetadataUpgradeable token = IERC20MetadataUpgradeable(tokenAddress);
        uint256 decimalsRewardToken = uint256(token.decimals());
        require(decimalsRewardToken < 30, "Decimals must be less than 30");

        _poolRewardAddresses[nftPoolAddress].add(tokenAddress);
        _poolRewardTokens[nftPoolAddress][tokenAddress] = RewardToken({
            sharesPerSecond: sharesPerSecond,
            accTokenPerShare: 0,
            PRECISION_FACTOR: uint256(10 ** (uint256(30) - decimalsRewardToken))
        });

        emit RewardTokenAdded(nftPoolAddress, tokenAddress, sharesPerSecond);
    }

    function updateRewardToken(
        address nftPoolAddress,
        address tokenAddress,
        uint256 sharesPerSecond
    ) external validatePool(nftPoolAddress) {
        _checkIsPoolTokenOperator(nftPoolAddress);
        _validatePoolRewardToken(nftPoolAddress, tokenAddress);

        _poolRewardTokens[nftPoolAddress][tokenAddress].sharesPerSecond = sharesPerSecond;

        emit RewardTokenUpdated(nftPoolAddress, tokenAddress, sharesPerSecond);
    }

    function removeRewardToken(address nftPoolAddress, address tokenAddress) external {
        _checkIsPoolTokenOperator(nftPoolAddress);
        _validatePoolRewardToken(nftPoolAddress, tokenAddress);

        _poolRewardAddresses[nftPoolAddress].remove(tokenAddress);
        delete _poolRewardTokens[nftPoolAddress][tokenAddress];

        IERC20MetadataUpgradeable rewardToken = IERC20MetadataUpgradeable(tokenAddress);
        uint256 balance = rewardToken.balanceOf(address(this));
        if (balance > 0) {
            rewardToken.safeTransfer(msg.sender, balance);
        }

        emit RewardTokenRemoved(nftPoolAddress, tokenAddress);
    }

    // ==================================== INTERNAL FUNCTIONS ====================================== //

    // pool should be validated before calling here
    function _checkIsPoolTokenOperator(address nftPoolAddress) internal view {
        require(
            _approvedForPool[nftPoolAddress].contains(msg.sender) || hasRole(ADMIN_ROLE, msg.sender),
            "Not a token operator"
        );
    }

    function _validatePoolRewardToken(address nftPoolAddress, address tokenAddress) internal view {
        require(tokenAddress != address(0), "Token not provided");
        require(_poolRewardAddresses[nftPoolAddress].contains(tokenAddress), "Token not added for pool");
    }

    function _safeRewardsTransfer(address tokenAddress, address to, uint256 amount) internal returns (uint256) {
        IERC20MetadataUpgradeable token = IERC20MetadataUpgradeable(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        // cap to available balance
        if (amount > balance) {
            amount = balance;
        }

        token.safeTransfer(to, amount);

        return amount;
    }
}
