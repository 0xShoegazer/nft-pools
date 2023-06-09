// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "./interfaces/IArbidexMasterChef.sol";
import "./interfaces/IChefRamsey.sol";
import "./interfaces/INFTPool.sol";
import "./interfaces/IYieldBooster.sol";
import "./interfaces/IXToken.sol";

contract ChefRamsey is AccessControlUpgradeable, IChefRamsey {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeMathUpgradeable for uint256; // solc 0.8+ version to not fuck up Cam teams math
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Info of each NFT pool
    struct PoolInfo {
        uint256 allocPoint; // How many allocation points assigned to this NFT pool
        uint256 lastRewardTime; // Last time that distribution to this NFT pool occurs
        uint256 reserve; // Pending rewards to distribute to the NFT pool
    }

    uint256 public mainChefPoolId;

    address public treasury;

    IERC20Upgradeable public _mainToken;
    IERC20Upgradeable public dummyToken;
    IArbidexMasterChef public mainChef;
    IYieldBooster private _yieldBooster; // Contract address handling yield boosts

    // This contract will need to be whitelisted by xToken since xToken is non transferable by default
    IXToken public xToken;

    mapping(address => PoolInfo) private _poolInfo; // Pools' information
    EnumerableSetUpgradeable.AddressSet private _pools; // All existing pool addresses
    EnumerableSetUpgradeable.AddressSet private _activePools; // Only contains pool addresses w/ allocPoints > 0

    uint256 public totalAllocPoint; // Total allocation points. Must be the sum of all allocation points in all pools
    uint256 public startTime; // The time at which farming starts

    bool public override emergencyUnlock; // Used by pools to release all their locks at once in case of emergency

    /********************************************/
    /****************** EVENTS ******************/
    /********************************************/

    event ClaimRewards(address indexed poolAddress, uint256 amount);
    event PoolAdded(address indexed poolAddress, uint256 allocPoint);
    event PoolSet(address indexed poolAddress, uint256 allocPoint);
    event SetYieldBooster(address previousYieldBooster, address newYieldBooster);
    event PoolUpdated(address indexed poolAddress, uint256 reserve, uint256 lastRewardTime);
    event SetEmergencyUnlock(bool emergencyUnlock);
    event Harvest(uint256 arxAmount, uint256 wethAmount);
    event AddRewardToken(address token, uint256 rewardPerSecond);
    event SetTokenRewardRate(address token, uint256 oldRate, uint256 newRate);

    /***********************************************/
    /****************** MODIFIERS ******************/
    /***********************************************/

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, _msgSender()), "Not an admin");
        _;
    }

    /*
     * @dev Check if a pool exists
     */
    modifier validatePool(address poolAddress) {
        require(_pools.contains(poolAddress), "validatePool: pool does not exist");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IXToken _xToken,
        IArbidexMasterChef _chef,
        address _treasury,
        IYieldBooster _boost
    ) public initializer {
        __AccessControl_init();

        xToken = _xToken;
        mainChef = _chef;
        _mainToken = IERC20Upgradeable(mainChef.arx());
        treasury = _treasury;
        _yieldBooster = _boost;

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(ADMIN_ROLE, _msgSender());
        _grantRole(ADMIN_ROLE, _treasury);

        // Sentinel value used to checked in start function
        mainChefPoolId = type(uint256).max;
    }

    // Allow approval to happen after initialize function instead of bothering with predict address stuff right now
    function start(IERC20Upgradeable _dummyToken, uint256 _poolId) external onlyAdmin {
        require(mainChefPoolId == type(uint256).max, "Already initialized");

        uint256 callerBalance = _dummyToken.balanceOf(msg.sender);
        require(callerBalance != 0, "Zero token balance");

        mainChefPoolId = _poolId;
        dummyToken = _dummyToken;

        dummyToken.safeTransferFrom(msg.sender, address(this), callerBalance);
        dummyToken.safeApprove(address(mainChef), callerBalance);
        mainChef.deposit(_poolId, callerBalance);
    }

    function harvest() public {
        uint256 poolId = mainChefPoolId;
        address thisAddress = address(this);

        uint256 pendingArx = mainChef.pendingArx(poolId, thisAddress);
        uint256 pendingWETH = mainChef.pendingWETH(poolId, thisAddress);

        IERC20Upgradeable wethToken = IERC20Upgradeable(mainChef.WETH());
        uint256 arxBalanceBefore = _mainToken.balanceOf(thisAddress);
        uint256 wethBalanceBefore = wethToken.balanceOf(thisAddress);

        // Trigger harvest
        mainChef.deposit(poolId, 0);

        uint256 arxReceived = _mainToken.balanceOf(thisAddress) - arxBalanceBefore;
        uint256 wethReceived = wethToken.balanceOf(thisAddress) - wethBalanceBefore;

        // TODO: updatePools()..?

        emit Harvest(arxReceived, wethReceived);
    }

    /**************************************************/
    /****************** PUBLIC VIEWS ******************/
    /**************************************************/

    function mainToken() external view override returns (address) {
        return address(_mainToken);
    }

    /**
     * @dev Returns emission rate (allocated to this contract)
     */
    function emissionRate() public view returns (uint256) {
        // what % of that rate is our allocation
        // rate * allocation points / total allocation (from chef)
        uint256 rewardPerSecond = mainChef.arxPerSec();
        uint totalAllocationPoints = mainChef.arxTotalAllocPoint();
        ArbidexPoolInfo memory poolInfo = getMainChefPoolInfo();
        return (rewardPerSecond * poolInfo.arxAllocPoint) / totalAllocationPoints;
    }

    function getMainChefPoolInfo() public view returns (ArbidexPoolInfo memory) {
        return mainChef.poolInfo(mainChefPoolId);
    }

    function owner() external view override returns (address) {
        return treasury;
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    function yieldBooster() external view override returns (address) {
        return address(_yieldBooster);
    }

    /**
     * @dev Returns the number of available pools
     */
    function poolsLength() external view returns (uint256) {
        return _pools.length();
    }

    /**
     * @dev Returns a pool from its "index"
     */
    function getPoolAddressByIndex(uint256 index) external view returns (address) {
        if (index >= _pools.length()) return address(0);
        return _pools.at(index);
    }

    /**
     * @dev Returns the number of active pools
     */
    function activePoolsLength() external view returns (uint256) {
        return _activePools.length();
    }

    /**
     * @dev Returns an active pool from its "index"
     */
    function getActivePoolAddressByIndex(uint256 index) external view returns (address) {
        if (index >= _activePools.length()) return address(0);
        return _activePools.at(index);
    }

    /**
     * @dev Returns data of a given pool
     */
    function getPoolInfo(
        address poolAddress_
    )
        external
        view
        override
        returns (
            address poolAddress,
            uint256 allocPoint,
            uint256 lastRewardTime,
            uint256 reserve,
            uint256 poolEmissionRate
        )
    {
        PoolInfo memory pool = _poolInfo[poolAddress_];

        poolAddress = poolAddress_;
        allocPoint = pool.allocPoint;
        lastRewardTime = pool.lastRewardTime;
        reserve = pool.reserve;

        if (totalAllocPoint == 0) {
            poolEmissionRate = 0;
        } else {
            poolEmissionRate = emissionRate().mul(allocPoint).div(totalAllocPoint);
        }
    }

    /****************************************************************/
    /****************** EXTERNAL PUBLIC FUNCTIONS  ******************/
    /****************************************************************/

    /**
     * @dev Updates rewards states of the given pool to be up-to-date
     */
    function updatePool(address nftPool) external validatePool(nftPool) {
        _updatePool(nftPool);
    }

    /**
     * @dev Updates rewards states for all pools
     *
     * Be careful of gas spending
     */
    function massUpdatePools() external {
        _massUpdatePools();
    }

    /**
     * @dev Transfer to a pool its pending rewards in reserve, can only be called by the NFT pool contract itself
     */
    function claimRewards() external override returns (uint256 rewardsAmount) {
        // check if caller is a listed pool
        if (!_pools.contains(msg.sender)) {
            return 0;
        }

        _updatePool(msg.sender);

        // updates caller's reserve
        PoolInfo storage pool = _poolInfo[msg.sender];
        uint256 reserve = pool.reserve;
        if (reserve == 0) {
            return 0;
        }
        pool.reserve = 0;

        emit ClaimRewards(msg.sender, reserve);
        return _safeRewardsTransfer(msg.sender, reserve);
    }

    /********************************************************/
    /****************** INTERNAL FUNCTIONS ******************/
    /********************************************************/

    /**
     * @dev Safe token transfer function, in case rounding error causes pool to not have enough tokens
     */
    function _safeRewardsTransfer(address to, uint256 amount) internal returns (uint256 effectiveAmount) {
        uint256 tokenBalance = _mainToken.balanceOf(address(this));

        if (amount > tokenBalance) {
            amount = tokenBalance;
        }

        _mainToken.safeTransfer(to, amount);

        return amount;
    }

    /**
     * @dev Updates rewards states of the given pool to be up-to-date
     *
     * Pool should be validated prior to calling this
     */
    function _updatePool(address poolAddress) internal {
        PoolInfo storage pool = _poolInfo[poolAddress];

        uint256 currentBlockTimestamp = block.timestamp;

        uint256 lastRewardTime = pool.lastRewardTime; // gas saving

        if (currentBlockTimestamp <= lastRewardTime) {
            return;
        }

        uint256 allocPoint = pool.allocPoint; // gas saving

        // do not allocate rewards if pool is not active
        if (allocPoint > 0 && INFTPool(poolAddress).hasDeposits()) {
            // calculate how much GRAIL rewards are expected to be received for this pool
            uint256 rewards = currentBlockTimestamp.sub(lastRewardTime).mul(emissionRate()).mul(allocPoint).div(
                totalAllocPoint
            ); // nbSeconds

            // claim expected rewards from the token
            // use returns effective minted amount instead of expected amount
            // (rewards) = _mainTokenToken.claimMasterRewards(rewards);

            // updates pool data
            pool.reserve = pool.reserve.add(rewards);
        }

        // TODO: "Extra" rewards should probably be managed here as well

        pool.lastRewardTime = currentBlockTimestamp;

        emit PoolUpdated(poolAddress, pool.reserve, currentBlockTimestamp);
    }

    /**
     * @dev Updates rewards states for all pools
     *
     * Be careful of gas spending
     */
    function _massUpdatePools() internal {
        uint256 length = _activePools.length();
        for (uint256 index = 0; index < length; ++index) {
            _updatePool(_activePools.at(index));
        }
    }

    /********************************************************/
    /****************** ADMIN FUNCTIONS ******************/
    /********************************************************/

    function withdrawFromPool(IERC20Upgradeable _dummyToken) external onlyAdmin {
        ArbidexPoolUserInfo memory poolInfo = mainChef.userInfo(mainChefPoolId, address(this));
        if (poolInfo.amount > 0) {
            mainChef.withdraw(mainChefPoolId, poolInfo.amount);
            _dummyToken.safeTransfer(_msgSender(), _dummyToken.balanceOf(address(this)));
        }
    }

    /**
     * @dev Set YieldBooster contract's address
     *
     * Must only be called by the owner
     */
    function setYieldBooster(IYieldBooster yieldBooster_) external onlyAdmin {
        require(address(yieldBooster_) != address(0), "setYieldBooster: cannot be set to zero address");
        emit SetYieldBooster(address(_yieldBooster), address(yieldBooster_));
        _yieldBooster = yieldBooster_;
    }

    /**
     * @dev Set emergency unlock status for all pools
     *
     * Must only be called by the owner
     */
    function setEmergencyUnlock(bool emergencyUnlock_) external onlyAdmin {
        emergencyUnlock = emergencyUnlock_;
        emit SetEmergencyUnlock(emergencyUnlock);
    }

    /**
     * @dev Adds a new pool
     * param withUpdate should be set to true every time it's possible
     *
     * Must only be called by the owner
     */
    function add(INFTPool nftPool, uint256 allocPoint, bool withUpdate) external onlyAdmin {
        address poolAddress = address(nftPool);
        require(!_pools.contains(poolAddress), "add: pool already exists");

        if (allocPoint > 0) {
            if (withUpdate) {
                // Update all pools if new pool allocPoint > 0
                _massUpdatePools();
            }
            _activePools.add(poolAddress);
        }

        // update lastRewardTime if startTime has already been passed
        uint256 lastRewardTime = block.timestamp;

        // update totalAllocPoint with the new pool's points
        totalAllocPoint = totalAllocPoint.add(allocPoint);

        // add new pool
        _poolInfo[poolAddress] = PoolInfo({ allocPoint: allocPoint, lastRewardTime: lastRewardTime, reserve: 0 });
        _pools.add(poolAddress);

        emit PoolAdded(poolAddress, allocPoint);
    }

    /**
     * @dev Updates configuration on existing pool
     * param withUpdate should be set to true every time it's possible
     *
     * Must only be called by the owner
     */
    function set(
        address poolAddress,
        uint256 allocPoint,
        bool withUpdate
    ) external validatePool(poolAddress) onlyAdmin {
        PoolInfo storage pool = _poolInfo[poolAddress];
        uint256 prevAllocPoint = pool.allocPoint;

        if (withUpdate) {
            _massUpdatePools();
        }

        _updatePool(poolAddress);

        // update (pool's and total) allocPoints
        pool.allocPoint = allocPoint;
        totalAllocPoint = totalAllocPoint.sub(prevAllocPoint).add(allocPoint);

        // if request is activating the pool
        if (prevAllocPoint == 0 && allocPoint > 0) {
            _activePools.add(poolAddress);
        }
        // if request is deactivating the pool
        else if (prevAllocPoint > 0 && allocPoint == 0) {
            _activePools.remove(poolAddress);
        }

        emit PoolSet(poolAddress, allocPoint);
    }
}
