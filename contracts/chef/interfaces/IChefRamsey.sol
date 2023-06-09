// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

interface IChefRamsey {
    function mainToken() external view returns (address);

    function yieldBooster() external view returns (address);

    function owner() external view returns (address);

    function emergencyUnlock() external view returns (bool);

    function getPoolInfo(
        address _poolAddress
    )
        external
        view
        returns (
            address poolAddress,
            uint256 allocPoint,
            uint256 lastRewardTime,
            uint256 reserve,
            uint256 reserveWETH,
            uint256 poolEmissionRate,
            uint256 poolEmissionRateWETH
        );

    function claimRewards() external returns (uint256 rewardAmount, uint256 amountWETH);

    function isAdmin(address) external view returns (bool);
}
