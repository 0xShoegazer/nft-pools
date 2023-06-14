// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

contract PoolRewardManager is AccessControlUpgradeable {
    using SafeERC20Upgradeable for IERC20MetadataUpgradeable;
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    struct RewardToken {
        uint256 sharesPerSecond;
        uint256 accTokenPerShare;
        uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public treasury;

    // List of active pools
    EnumerableSetUpgradeable.AddressSet private _pools;

    // pool => list of reward token addresses
    mapping(address => EnumerableSetUpgradeable.AddressSet) private _poolRewardAddresses;
    // pool => token => info
    mapping(address => mapping(address => RewardToken)) private _poolRewardTokens;

    // per token reward debt for each NFT position for a pool
    mapping(address => mapping(uint256 => mapping(address => uint256))) public positionRewardDebts;

    event PoolAdded(address nftPoolAddress);
    event RewardTokenAdded(address indexed nftPoolAddress, address token, uint256 sharesPerSecond);
    event RewardTokenUpdated(address indexed nftPoolAddress, address token, uint256 sharesPerSecond);
    event RewardTokenRemoved(address indexed nftPoolAddress, address token);
    event RewardTokenHarvested(address indexed nftPoolAddress, address token, uint256 amount, uint256 tokenId);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not an admin");
        _;
    }

    modifier validatePool(address nftPoolAddress) {
        require(nftPoolAddress != address(0), "Pool not provided");
        require(_pools.contains(nftPoolAddress), "Pool not added");
        _;
    }

    // modifier onlyPool() {
    //     require(poolAddress != address(0) && msg.sender == poolAddress, "Only pool");
    //     _;
    // }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _treasury) public initializer {
        require(_treasury != address(0), "Treasury not provided");

        __AccessControl_init();

        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, _treasury);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _treasury);
    }

    // ==================================== VIEW ====================================== //

    function getPoolCount() public view returns (uint256) {
        return _pools.length();
    }

    function getPoolAddresses() public view returns (address[] memory) {
        return _pools.values();
    }

    // ==================================== ADMIN ====================================== //

    function addPool(address nftPoolAddress) external onlyAdmin {
        require(!_pools.contains(nftPoolAddress), "Pool already added");

        _pools.add(nftPoolAddress);
        emit PoolAdded(nftPoolAddress);
    }

    function addRewardToken(
        address nftPoolAddress,
        address tokenAddress,
        uint256 sharesPerSecond
    ) external validatePool(nftPoolAddress) onlyAdmin {
        require(tokenAddress != address(0), "Token not provided");
        require(!_poolRewardAddresses[nftPoolAddress].contains(tokenAddress), "Token already added for pool");

        IERC20MetadataUpgradeable token = IERC20MetadataUpgradeable(tokenAddress);
        uint256 decimalsRewardToken = uint256(token.decimals());
        require(decimalsRewardToken < 30, "Must be less than 30");

        _poolRewardAddresses[nftPoolAddress].add(tokenAddress);
        _poolRewardTokens[nftPoolAddress][tokenAddress] = RewardToken({
            sharesPerSecond: sharesPerSecond,
            accTokenPerShare: 0,
            PRECISION_FACTOR: uint256(10 ** (uint256(30) - decimalsRewardToken))
        });

        emit RewardTokenAdded(nftPoolAddress, tokenAddress, sharesPerSecond);
    }

    function _validatePool(address nftPoolAddress) internal {
        require(nftPoolAddress != address(0), "Pool not provided");
        require(_pools.contains(nftPoolAddress), "Pool not added");
    }
}
