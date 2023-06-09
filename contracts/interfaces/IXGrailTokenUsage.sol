// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

/**
 * This is the "plugin" mechanism described in the docs.
 * xGrailToken relies on this interface for connecting different strategies/plugins/etc to the system.
 */
interface IXGrailTokenUsage {
    function allocate(address userAddress, uint256 amount, bytes calldata data) external;

    function deallocate(address userAddress, uint256 amount, bytes calldata data) external;
}
