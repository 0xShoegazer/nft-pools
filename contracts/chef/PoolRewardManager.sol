// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

/// @dev Contract only exists due to an issue with bytecode size coming out from solc 7 compiler and Arbitrum deployment
contract PoolRewardManager is AccessControlUpgradeable {
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    struct RewardToken {
        uint256 sharesPerSecond;
        uint256 accTokenPerShare;
        uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public poolAddress;
    address public treasury;

    EnumerableSetUpgradeable.AddressSet private _rewardTokenAddresses;
    mapping(address => RewardToken) private _rewardTokens;

    mapping(uint256 => mapping(address => uint256)) public positionRewardDebts; // per token reward debt for each NFT position

    event RewardTokenAdded(address token, uint256 sharesPerSecond);
    event RewardTokenUpdated(address token, uint256 sharesPerSecond);
    event RewardTokenRemoved(address token);
    event RewardTokenHarvested(address token, uint256 amount);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    modifier onlyPool() {
        require(poolAddress != address(0) && msg.sender == poolAddress, "Only pool");
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

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _treasury);
    }

    // ==================================== VIEW ====================================== //

    function getRewardTokenAddresses() external view returns (address[] memory) {
        return _rewardTokenAddresses.values();
    }

    function getRewardTokens() external view returns (RewardToken[] memory rewards) {
        uint256 currentRewardTokenCount = getCurrentRewardCount();
        rewards = new RewardToken[](currentRewardTokenCount);

        address tokenAddress;

        for (uint256 i = 0; i < currentRewardTokenCount; ) {
            tokenAddress = _rewardTokenAddresses.at(i);
            rewards[i] = _rewardTokens[tokenAddress];

            unchecked {
                ++i;
            }
        }
    }

    function getCurrentRewardCount() public view returns (uint256) {
        return _rewardTokenAddresses.length();
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
        uint256 currentRewardTokenCount = getCurrentRewardCount();
        tokens = new address[](currentRewardTokenCount);
        rewardAmounts = new uint256[](currentRewardTokenCount);

        // Stack too deep
        RewardToken memory currentReward;
        uint256 positionAmount = positionAmountMultiplied;
        uint256 positionTokenId = tokenId;
        uint256 rewardAmountForDuration;
        uint256 adjustedTokenPerShare;
        uint256 currentRewardDebt;
        address tokenAddress;
        uint256 timeSinceLastReward = block.timestamp - lastRewardTime;

        for (uint256 i = 0; i < currentRewardTokenCount; ) {
            tokenAddress = _rewardTokenAddresses.at(i);
            currentReward = _rewardTokens[tokenAddress];
            tokens[i] = tokenAddress;

            if (block.timestamp > lastRewardTime && lpSupplyWithMultiplier > 0) {
                rewardAmountForDuration = timeSinceLastReward * currentReward.sharesPerSecond;

                adjustedTokenPerShare =
                    (rewardAmountForDuration * currentReward.PRECISION_FACTOR) /
                    lpSupplyWithMultiplier;
                adjustedTokenPerShare = currentReward.accTokenPerShare + adjustedTokenPerShare;

                currentRewardDebt = positionRewardDebts[positionTokenId][tokenAddress];
                rewardAmounts[i] =
                    (positionAmount * adjustedTokenPerShare) /
                    currentReward.PRECISION_FACTOR -
                    currentRewardDebt;
            }

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Update reward debt for any/all additional reward tokens
     * Only callable by pool
     * Pool calls this each time _updateBoostMultiplierInfoAndRewardDebt() is called
     */
    function updatePositionRewardDebts(uint256 positionAmountMultiplied, uint256 tokenId) external onlyPool {
        uint256 currentRewardCount = getCurrentRewardCount();

        if (currentRewardCount == 0) {
            return;
        }

        RewardToken memory currentReward;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; ) {
            tokenAddress = _rewardTokenAddresses.at(i);
            currentReward = _rewardTokens[tokenAddress];

            positionRewardDebts[tokenId][tokenAddress] =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR;

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Update reward per share for all current reward tokens
     * Only callable by pool
     * Pools calls each time _updatePool() is called
     */
    function updateRewardsPerShare(uint256 lpSupplyMultiplied, uint256 lastRewardTime) external onlyPool {
        uint256 currentRewardCount = getCurrentRewardCount();

        if (currentRewardCount == 0 || lpSupplyMultiplied == 0) return;

        uint256 currentDuration = block.timestamp - lastRewardTime;
        uint256 rewardAmountForDuration;
        uint256 accTokenPerShare;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; i++) {
            tokenAddress = _rewardTokenAddresses.at(i);
            RewardToken storage reward = _rewardTokens[tokenAddress];

            rewardAmountForDuration = currentDuration * reward.sharesPerSecond;
            accTokenPerShare = (rewardAmountForDuration * reward.PRECISION_FACTOR) / lpSupplyMultiplied;

            reward.accTokenPerShare += accTokenPerShare;
        }
    }

    /**
     * @dev Harvests any additional rewards for the position
     * Only callable by pool
     * Pools calls each time _harvestPosition() is called
     * All harvest function variants in pool contract result in call to _harvestPosition()
     */
    function harvestAdditionalRewards(
        uint256 positionAmountMultiplied,
        address recipient,
        uint256 tokenId
    ) external onlyPool {
        uint256 currentRewardCount = getCurrentRewardCount();

        if (currentRewardCount == 0) {
            return;
        }

        require(recipient != address(0), "NFTPoolRewardManager: Zero address recipient");

        RewardToken memory currentReward;
        uint256 pendingAmount;
        address tokenAddress;

        for (uint256 i = 0; i < currentRewardCount; ) {
            tokenAddress = _rewardTokenAddresses.at(i);
            currentReward = _rewardTokens[tokenAddress];

            pendingAmount =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR -
                positionRewardDebts[tokenId][tokenAddress];

            if (pendingAmount > 0) {
                emit RewardTokenHarvested(tokenAddress, pendingAmount);
                _safeRewardsTransfer(tokenAddress, recipient, pendingAmount);
            }

            unchecked {
                ++i;
            }
        }
    }

    // ==================================== ADMIN ====================================== //

    function initializePool(address _incomingPoolAddress) external onlyAdmin {
        require(poolAddress == address(0), "Already initialized");
        require(_incomingPoolAddress != address(0), "Address not provided");

        poolAddress = _incomingPoolAddress;
    }

    function addRewardToken(address tokenAddress, uint256 sharesPerSecond) external onlyAdmin {
        require(tokenAddress != address(0), "Token not provided");
        require(!_rewardTokenAddresses.contains(tokenAddress), "Token already added");

        IERC20MetadataUpgradeable token = IERC20MetadataUpgradeable(tokenAddress);
        uint256 decimalsRewardToken = uint256(token.decimals());
        require(decimalsRewardToken < 30, "Must be less than 30");

        _rewardTokenAddresses.add(tokenAddress);
        _rewardTokens[tokenAddress] = RewardToken({
            sharesPerSecond: sharesPerSecond,
            accTokenPerShare: 0,
            PRECISION_FACTOR: uint256(10 ** (uint256(30) - decimalsRewardToken))
        });

        emit RewardTokenAdded(tokenAddress, sharesPerSecond);
    }

    function updateRewardToken(address tokenAddress, uint256 sharesPerSecond) external onlyAdmin {
        _validateToken(tokenAddress);

        _rewardTokens[tokenAddress].sharesPerSecond = sharesPerSecond;

        emit RewardTokenUpdated(tokenAddress, sharesPerSecond);
    }

    function removeRewardToken(address tokenAddress) external {
        require(msg.sender == treasury, "Only treasury");
        _validateToken(tokenAddress);

        _rewardTokenAddresses.remove(tokenAddress);
        delete _rewardTokens[tokenAddress];

        IERC20MetadataUpgradeable rewardToken = IERC20MetadataUpgradeable(tokenAddress);
        uint256 balance = rewardToken.balanceOf(address(this));
        if (balance > 0) {
            rewardToken.safeTransfer(treasury, balance);
        }

        emit RewardTokenRemoved(tokenAddress);
    }

    function _validateToken(address tokenAddress) internal view {
        require(tokenAddress != address(0), "Token not provided");
        require(_rewardTokenAddresses.contains(tokenAddress), "Token not added");
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
