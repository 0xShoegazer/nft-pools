export const MASTER_CHEF_ABI = [
  {
    inputs: [
      {
        internalType: 'contract IArbidexMasterChef',
        name: '_chef',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address',
      },
      {
        internalType: 'contract IYieldBooster',
        name: '_boost',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: '_dummyToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountWETH',
        type: 'uint256',
      },
    ],
    name: 'ClaimRewards',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'arxAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'wethAmount',
        type: 'uint256',
      },
    ],
    name: 'Harvest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'allocPointsARX',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'allocPointsWETH',
        type: 'uint256',
      },
    ],
    name: 'PoolAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'allocPointsARX',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'allocPointsWETH',
        type: 'uint256',
      },
    ],
    name: 'PoolSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserve',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserveWETH',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lastRewardTime',
        type: 'uint256',
      },
    ],
    name: 'PoolUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'emergencyUnlock',
        type: 'bool',
      },
    ],
    name: 'SetEmergencyUnlock',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousYieldBooster',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newYieldBooster',
        type: 'address',
      },
    ],
    name: 'SetYieldBooster',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokenWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'treasury',
        type: 'address',
      },
    ],
    name: 'TreasuryUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'WETH',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activePoolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract INFTPool',
        name: 'nftPool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsARX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsWETH',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'withUpdate',
        type: 'bool',
      },
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'addUnlockOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: 'rewardAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountWETH',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositToPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dummyToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyUnlock',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emissionRates',
    outputs: [
      {
        internalType: 'uint256',
        name: 'mainRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'wethRate',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getActivePoolAddressByIndex',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMainChefPoolInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'lpToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'arxAllocPoint',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'WETHAllocPoint',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastRewardTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'accArxPerShare',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'accWETHPerShare',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalDeposit',
            type: 'uint256',
          },
        ],
        internalType: 'struct ArbidexPoolInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOldChefUserInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'arxRewardDebt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'WETHRewardDebt',
            type: 'uint256',
          },
        ],
        internalType: 'struct ArbidexPoolUserInfo',
        name: 'poolInfo',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPendingRewardsFromOldChef',
    outputs: [
      {
        internalType: 'uint256',
        name: 'pendingARX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pendingWETH',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getPoolAddressByIndex',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'poolAddress_',
        type: 'address',
      },
    ],
    name: 'getPoolInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsARX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsWETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastRewardTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveWETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolEmissionRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolEmissionRateWETH',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRewardTokenBalances',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountARX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountWETH',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isUnlockOperator',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainChef',
    outputs: [
      {
        internalType: 'contract IArbidexMasterChef',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainChefPoolId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mainToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'massUpdatePools',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolsLength',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'removeUnlockOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsARX',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'allocPointsWETH',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'withUpdate',
        type: 'bool',
      },
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'emergencyUnlock_',
        type: 'bool',
      },
    ],
    name: 'setEmergencyUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IYieldBooster',
        name: 'yieldBooster_',
        type: 'address',
      },
    ],
    name: 'setYieldBooster',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'start',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAllocPointsARX',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAllocPointsWETH',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nftPool',
        type: 'address',
      },
    ],
    name: 'updatePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_treasury',
        type: 'address',
      },
    ],
    name: 'updateTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wethToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawFromPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'yieldBooster',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
