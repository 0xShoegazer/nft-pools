// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./interfaces/IArbidexMasterChef.sol";
import "./interfaces/IChefRamsey.sol";

contract ChefRamsey is OwnableUpgradeable {
    struct PoolInfo {
        address nftPoolAddress;
        uint256 allocPointsARX;
        uint256 allocPointsWETH;
    }

    IChefRamsey private _ramsey;

    constructor() {
        /// @custom:oz-upgrades-unsafe-allow constructor
        _disableInitializers();
    }

    function intialize(IChefRamsey ramsey) public initializer {
        _ramsey = ramsey;
    }

    function addPools() external onlyOwner {
        //
    }
}
