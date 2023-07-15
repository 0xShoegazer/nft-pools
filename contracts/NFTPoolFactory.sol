// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "./interfaces/tokens/IERC20Metadata.sol";

import "./interfaces/IMasterChef.sol";
import "./interfaces/tokens/IXToken.sol";
import "./NFTPool.sol";

contract NFTPoolFactory {
    IMasterChef public immutable master;
    IERC20Metadata public immutable protocolToken;
    IXToken public immutable xToken;

    address[] public pools;

    // lp token => pool
    mapping(address => address) public getPool;

    event PoolCreated(address indexed lpToken, address pool);

    constructor(IMasterChef _master, IERC20Metadata _protocolToken, IXToken _xToken) {
        master = _master;
        protocolToken = _protocolToken;
        xToken = _xToken;
    }

    function poolLength() external view returns (uint256) {
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

        NFTPool(pool).initialize(master, protocolToken, xToken, IERC20Metadata(lpToken));
        getPool[lpToken] = pool;
        pools.push(pool);

        emit PoolCreated(lpToken, pool);
    }
}
