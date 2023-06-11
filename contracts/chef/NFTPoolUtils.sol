// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract NFTPoolUtils is AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public poolAddress;

    modifier onlyPool() {
        require(msg.sender == poolAddress, "Only pool");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _poolAddress, address _treasury) public initializer {
        require(_poolAddress != address(0), "Pool not provided");
        require(_treasury != address(0), "Treasury not provided");

        __AccessControl_init();

        poolAddress = _poolAddress;

        _grantRole(DEFAULT_ADMIN_ROLE, _treasury);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _treasury);
    }

    function mergePosition(uint256 splitAmount) external onlyPool {
        // TODO: Would only work with DELEGATECALL from the pool to access state really
        //
        //   _requireOnlyOwnerOf(tokenId);
        // _updatePool();
        // _harvestPosition(tokenId, ERC721.ownerOf(tokenId));
        // StakingPosition storage position = _stakingPositions[tokenId];
        // // can't have the original token completely emptied
        // require(splitAmount < position.amount, "invalid splitAmount");
        // // sub from existing position
        // position.amount = position.amount.sub(splitAmount);
        // _updateBoostMultiplierInfoAndRewardDebt(position);
        // // create new position
        // uint256 currentTokenId = _mintNextTokenId(msg.sender);
        // uint256 lockDuration = position.lockDuration;
        // uint256 lockMultiplier = position.lockMultiplier;
        // uint256 amountWithMultiplier = splitAmount.mul(lockMultiplier.add(1e4)).div(1e4);
        // _stakingPositions[currentTokenId] = StakingPosition({
        //     amount: splitAmount,
        //     rewardDebt: amountWithMultiplier.mul(_accRewardsPerShare).div(1e18),
        //     lockDuration: lockDuration,
        //     startLockTime: position.startLockTime,
        //     lockMultiplier: lockMultiplier,
        //     amountWithMultiplier: amountWithMultiplier,
        //     boostPoints: 0,
        //     totalMultiplier: lockMultiplier,
        //     pendingGrailRewards: 0,
        //     pendingXGrailRewards: 0
        // });
        // _lpSupplyWithMultiplier = _lpSupplyWithMultiplier.add(amountWithMultiplier);
        // emit SplitPosition(tokenId, splitAmount, currentTokenId);
    }

    function splitPosition() external onlyPool {
        // TODO: Would only work with DELEGATECALL from the pool to access state really
        //
    }
}
