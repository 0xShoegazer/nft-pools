// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/INFTPoolRewardManager.sol";
import "./interfaces/tokens/IERC20Metadata.sol";

contract NFTPoolRewardManager is AccessControl {
    using SafeMath for uint256;
    using SafeERC20 for IERC20Metadata;

    struct RewardToken {
        IERC20Metadata token;
        uint256 sharesPerSecond;
        uint256 startTime;
        uint256 endTime;
        uint256 accTokenPerShare;
        uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public poolAddress;

    RewardToken[] public rewardTokens;
    mapping(uint256 => mapping(address => uint256)) public positionRewardDebts; // per token reward debt for each NFT position

    event RewardTokenAdded(IERC20Metadata token, uint256 sharesPerSecond, uint256 startTime, uint256 endTime);
    event RewardTokenUpdated(IERC20Metadata token, uint256 sharesPerSecond, uint256 endTime);
    event RewardTokenHarvested(IERC20Metadata token, uint256 amount);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    modifier onlyPool() {
        require(poolAddress != address(0) && msg.sender == poolAddress, "Only pool");
        _;
    }

    constructor(address treasury) {
        require(treasury != address(0), "Treasury not provided");

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(ADMIN_ROLE, msg.sender);
        grantRole(ADMIN_ROLE, treasury);
    }

    function initialize(address _poolAddress) external onlyAdmin {
        require(poolAddress == address(0), "Already initialized");

        poolAddress = _poolAddress;
    }

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
        uint256 currentDuration;
        uint256 rewardAmountForDuration;
        uint256 adjustedTokenPerShare;
        uint256 currentRewardDebt;
        uint256 blockTime = block.timestamp;

        for (uint256 i = 0; i < currentRewardTokenCount; i++) {
            currentReward = rewardTokens[i];

            if (blockTime > lastRewardTime && lpSupplyWithMultiplier > 0) {
                currentDuration = blockTime.sub(lastRewardTime);
                rewardAmountForDuration = currentDuration.mul(currentReward.sharesPerSecond);

                adjustedTokenPerShare = rewardAmountForDuration.mul(currentReward.PRECISION_FACTOR).div(
                    lpSupplyWithMultiplier
                );
                adjustedTokenPerShare = currentReward.accTokenPerShare.add(adjustedTokenPerShare);

                currentRewardDebt = positionRewardDebts[positionTokenId][address(currentReward.token)];
                rewardAmounts[i] = positionAmount.mul(adjustedTokenPerShare).div(currentReward.PRECISION_FACTOR).sub(
                    currentRewardDebt
                );
            }
        }
    }

    /**
     * @dev Update reward debt for any/all additional reward tokens
     */
    function updatePositionRewardDebts(uint256 positionAmountMultiplied, uint256 tokenId) external onlyPool {
        if (rewardTokens.length == 0) {
            return;
        }

        RewardToken memory currentReward;
        uint256 rewardCount = rewardTokens.length;

        for (uint256 i = 0; i < rewardCount; i++) {
            currentReward = rewardTokens[i];

            positionRewardDebts[tokenId][address(currentReward.token)] = positionAmountMultiplied
                .mul(currentReward.accTokenPerShare)
                .div(currentReward.PRECISION_FACTOR);
        }
    }

    function updateRewardsPerShare(uint256 lpSupplyMultiplied, uint256 lastRewardTime) external onlyPool {
        uint256 rewardCount = rewardTokens.length;

        if (rewardCount == 0) return;

        uint256 currentDuration;
        uint256 rewardAmountForDuration;
        uint256 accTokenPerShare;
        uint256 blockTime = block.timestamp;

        for (uint256 i = 0; i < rewardCount; i++) {
            RewardToken storage reward = rewardTokens[i];
            currentDuration = blockTime.sub(lastRewardTime);
            rewardAmountForDuration = currentDuration.mul(reward.sharesPerSecond);
            accTokenPerShare = rewardAmountForDuration.mul(reward.PRECISION_FACTOR).div(lpSupplyMultiplied);

            reward.accTokenPerShare = reward.accTokenPerShare.add(accTokenPerShare);
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

        require(recipient != address(0), "");

        RewardToken memory currentReward;
        uint256 pendingAmount;
        address rewardAddress;

        for (uint256 i = 0; i < rewardCount; i++) {
            currentReward = rewardTokens[i];
            rewardAddress = address(currentReward.token);

            pendingAmount = positionAmountMultiplied
                .mul(currentReward.accTokenPerShare)
                .div(currentReward.PRECISION_FACTOR)
                .sub(positionRewardDebts[tokenId][rewardAddress]);

            if (pendingAmount > 0) {
                emit RewardTokenHarvested(currentReward.token, pendingAmount);
                _safeRewardsTransfer(rewardAddress, recipient, pendingAmount);
            }
        }
    }

    function addRewardToken(RewardToken memory reward) external onlyAdmin {
        // _requireOnlyOwner();

        require(address(reward.token) != address(0), "Token not provided");
        require(reward.startTime > block.timestamp, "Token start time in the past");
        require(reward.endTime > reward.startTime, "End time lte start time");

        uint256 decimalsRewardToken = uint256(reward.token.decimals());
        require(decimalsRewardToken < 30, "Must be less than 30");
        reward.PRECISION_FACTOR = uint256(10 ** (uint256(30) - decimalsRewardToken));
        reward.accTokenPerShare = 0;

        rewardTokens.push(reward);

        emit RewardTokenAdded(reward.token, reward.sharesPerSecond, reward.startTime, reward.endTime);
    }

    function updateRewardToken(uint256 tokenIndex, uint256 sharesPerSecond, uint256 endTime) external onlyAdmin {
        // _requireOnlyOwner();

        require(tokenIndex < rewardTokens.length, "Invalid token index");

        RewardToken storage reward = rewardTokens[tokenIndex];
        require(
            endTime >= reward.startTime && endTime > block.timestamp,
            "End time lte start time or current timestamp"
        );

        reward.sharesPerSecond = sharesPerSecond;
        reward.endTime = endTime;

        emit RewardTokenUpdated(reward.token, sharesPerSecond, endTime);
    }

    function withdrawToken(address token) external onlyAdmin {
        IERC20Metadata(token).safeTransfer(msg.sender, IERC20Metadata(token).balanceOf(address(this)));
    }

    /**
     * @dev Safe token transfer function, in case rounding error causes pool to not have enough tokens
     */
    function _safeRewardsTransfer(address tokenAddress, address to, uint256 amount) internal returns (uint256) {
        IERC20Metadata token = IERC20Metadata(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        // cap to available balance
        if (amount > balance) {
            amount = balance;
        }
        token.safeTransfer(to, amount);
        return amount;
    }
}
