// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IMasterChef.sol";
import "./interfaces/tokens/IXToken.sol";
import "./interfaces/tokens/IProtocolToken.sol";
import "./NFTPool.sol";

contract NFTPoolFactory {
    IMasterChef public immutable master; // Address of the master
    IProtocolToken public immutable protocolToken;
    IXToken public immutable xToken;

    // lp token => pool
    mapping(address => address) public getPool;
    address[] public pools;

    constructor(IMasterChef _master, IProtocolToken _protocolToken, IXToken _xToken) {
        master = _master;
        protocolToken = _protocolToken;
        xToken = _xToken;

        // Register under the same SFS NFT
        _protocolToken.feeShareContract().assign(_protocolToken.feeShareTokenId());
    }

    event PoolCreated(address indexed lpToken, address pool);

    function poolsLength() external view returns (uint256) {
        return pools.length;
    }

    function createPool(address lpToken) external returns (address pool) {
        require(getPool[lpToken] == address(0), "pool exists");

        bytes memory bytecode_ = type(NFTPool).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(lpToken));
        /* solhint-disable no-inline-assembly */
        assembly {
            pool := create2(0, add(bytecode_, 32), mload(bytecode_), salt)
        }
        require(pool != address(0), "failed");

        NFTPool(pool).initialize(master, protocolToken, xToken, IERC20(lpToken));
        getPool[lpToken] = pool;
        pools.push(pool);

        emit PoolCreated(lpToken, pool);
    }
}
