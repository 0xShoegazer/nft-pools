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
        IERC20MetadataUpgradeable token;
        uint256 sharesPerSecond;
        uint256 accTokenPerShare;
        uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public currentRewardCount;

    address public poolAddress;
    address public treasury;

    EnumerableSetUpgradeable.AddressSet private _rewardTokenAddresses;
    RewardToken[] public rewardTokens;

    mapping(address => RewardToken) private _rewardTokens;

    mapping(uint256 => mapping(address => uint256)) public positionRewardDebts; // per token reward debt for each NFT position

    event RewardTokenAdded(IERC20MetadataUpgradeable token, uint256 sharesPerSecond);
    event RewardTokenUpdated(IERC20MetadataUpgradeable token, uint256 sharesPerSecond);
    event RewardTokenRemoved(IERC20MetadataUpgradeable token);
    event RewardTokenHarvested(IERC20MetadataUpgradeable token, uint256 amount);

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

    function initializePool(address _incomingPoolAddress) external onlyAdmin {
        require(poolAddress == address(0), "Already initialized");
        require(_incomingPoolAddress != address(0), "Address not provided");

        poolAddress = _incomingPoolAddress;
    }

    function getRewardTokenAddresses() external view returns (address[] memory) {
        return _rewardTokenAddresses.values();
    }

    function getRewardTokens() external view returns (RewardToken[] memory) {
        return rewardTokens;
    }

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
        uint256 currentRewardTokenCount = rewardTokens.length;
        tokens = new address[](currentRewardTokenCount);
        rewardAmounts = new uint256[](currentRewardTokenCount);

        // Stack too deep
        RewardToken memory currentReward;
        uint256 positionAmount = positionAmountMultiplied;
        uint256 positionTokenId = tokenId;
        uint256 rewardAmountForDuration;
        uint256 adjustedTokenPerShare;
        uint256 currentRewardDebt;

        uint256 timeSinceLastReward = block.timestamp - lastRewardTime;

        for (uint256 i = 0; i < currentRewardTokenCount; ) {
            currentReward = rewardTokens[i];
            tokens[i] = address(currentReward.token);

            if (block.timestamp > lastRewardTime && lpSupplyWithMultiplier > 0) {
                rewardAmountForDuration = timeSinceLastReward * currentReward.sharesPerSecond;

                adjustedTokenPerShare =
                    (rewardAmountForDuration * currentReward.PRECISION_FACTOR) /
                    lpSupplyWithMultiplier;
                adjustedTokenPerShare = currentReward.accTokenPerShare + adjustedTokenPerShare;

                currentRewardDebt = positionRewardDebts[positionTokenId][address(currentReward.token)];
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
     */
    function updatePositionRewardDebts(uint256 positionAmountMultiplied, uint256 tokenId) external onlyPool {
        if (rewardTokens.length == 0) {
            return;
        }

        RewardToken memory currentReward;
        uint256 rewardCount = rewardTokens.length;

        for (uint256 i = 0; i < rewardCount; ) {
            currentReward = rewardTokens[i];

            positionRewardDebts[tokenId][address(currentReward.token)] =
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
     */
    function updateRewardsPerShare(uint256 lpSupplyMultiplied, uint256 lastRewardTime) external onlyPool {
        uint256 rewardCount = rewardTokens.length;

        if (rewardCount == 0 || lpSupplyMultiplied == 0) return;

        uint256 currentDuration;
        uint256 rewardAmountForDuration;
        uint256 accTokenPerShare;
        uint256 timeOfLastReward = lastRewardTime;

        for (uint256 i = 0; i < rewardCount; i++) {
            RewardToken storage reward = rewardTokens[i];
            currentDuration = block.timestamp - timeOfLastReward;
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
        uint256 rewardCount = rewardTokens.length;
        if (rewardCount == 0) {
            return;
        }

        require(recipient != address(0), "NFTPoolRewardManager: Zero address recipient");

        RewardToken memory currentReward;
        uint256 pendingAmount;
        address rewardAddress;

        for (uint256 i = 0; i < rewardCount; ) {
            currentReward = rewardTokens[i];
            rewardAddress = address(currentReward.token);

            pendingAmount =
                (positionAmountMultiplied * currentReward.accTokenPerShare) /
                currentReward.PRECISION_FACTOR -
                positionRewardDebts[tokenId][rewardAddress];

            if (pendingAmount > 0) {
                emit RewardTokenHarvested(currentReward.token, pendingAmount);
                _safeRewardsTransfer(rewardAddress, recipient, pendingAmount);
            }

            unchecked {
                ++i;
            }
        }

        // TODO: Test reward debt after this. I think pool triggers updatePositionRewardDebts as needed
    }

    // ==================================== ADMIN ================================== //

    function addRewardToken(address tokenAddress, uint256 sharesPerSecond) external onlyAdmin {
        require(tokenAddress != address(0), "Token not provided");
        require(!_rewardTokenAddresses.contains(tokenAddress), "Token already added");

        IERC20MetadataUpgradeable token = IERC20MetadataUpgradeable(tokenAddress);
        uint256 decimalsRewardToken = uint256(token.decimals());
        require(decimalsRewardToken < 30, "Must be less than 30");

        // rewardTokens.push(
        //     RewardToken({
        //         token: token,
        //         sharesPerSecond: sharesPerSecond,
        //         accTokenPerShare: 0,
        //         PRECISION_FACTOR: uint256(10 ** (uint256(30) - decimalsRewardToken))
        //     })
        // );

        currentRewardCount++;

        _rewardTokenAddresses.add(tokenAddress);
        _rewardTokens[tokenAddress] = RewardToken({
            token: token,
            sharesPerSecond: sharesPerSecond,
            accTokenPerShare: 0,
            PRECISION_FACTOR: uint256(10 ** (uint256(30) - decimalsRewardToken))
        });

        emit RewardTokenAdded(token, sharesPerSecond);
    }

    function updateRewardToken(address tokenAddress, uint256 tokenIndex, uint256 sharesPerSecond) external onlyAdmin {
        _validateToken(tokenAddress, tokenIndex);

        RewardToken storage reward = rewardTokens[tokenIndex];
        require(address(reward.token) == tokenAddress, "Wrong token address for token index");

        _rewardTokens[tokenAddress].sharesPerSecond = sharesPerSecond;

        reward.sharesPerSecond = sharesPerSecond;
        emit RewardTokenUpdated(reward.token, sharesPerSecond);
    }

    function removeRewardToken(address tokenAddress, uint256 tokenIndex) external {
        require(msg.sender == treasury, "Only treasury");
        _validateToken(tokenAddress, tokenIndex);

        // RewardToken memory reward = rewardTokens[tokenIndex];
        // _rewardTokenAddresses.remove(address(reward.token));

        // uint256 balance = reward.token.balanceOf(address(this));
        // if (balance > 0) {
        //     reward.token.safeTransfer(treasury, balance);
        // }

        // delete rewardTokens[tokenIndex];

        RewardToken memory reward = rewardTokens[tokenIndex];
        _rewardTokenAddresses.remove(address(reward.token));

        uint256 balance = reward.token.balanceOf(address(this));
        if (balance > 0) {
            reward.token.safeTransfer(treasury, balance);
        }

        delete _rewardTokens[tokenAddress];

        emit RewardTokenRemoved(reward.token);
    }

    function _validateToken(address tokenAddress, uint256 tokenIndex) internal view {
        require(tokenAddress != address(0), "Token not provided");
        // require(tokenIndex < rewardTokens.length, "Invalid token index");
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
