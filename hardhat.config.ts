import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-contract-sizer';

dotenv.config();

const accounts = process.env.DEV_KEY !== undefined ? [process.env.DEV_KEY] : [];

const config = {
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        evmVersion: 'london', // TODO: For Scroll only. From their dev docs
        settings: {
          optimizer: {
            enabled: true,
            runs: 5000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.BASE_GOERLI}`,
        blockNumber: 7235933, // 3:30AM 7/18/2023
      },
      // chainId: 84531,
      accounts: [
        {
          privateKey: process.env.DEV_KEY,
          balance: '10000000000000000000',
        },
      ],
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC || '',
      accounts,
    },
    optimism: {
      url: `${process.env.OPTIMISM_RPC}`,
      accounts,
    },
    base: {
      url: `${process.env.BASE_RPC}`,
      accounts,
      chainId: 8453,
      // gas: 500000,
      // gasPrice: 100,
    },
    base_goerli: {
      url: `https://goerli.base.org`,
      accounts,
      chainId: 84531,
      gas: 500000,
      gasPrice: 100,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC,
      accounts,
      chainId: 534351,
    },
  },
  contractSizer: {
    // override defaults as needed: https://www.npmjs.com/package/hardhat-contract-sizer
  },
  etherscan: {
    apiKey: {
      base: 'PLACEHOLDER_KEY', // Chain doesn't require but hardhat needs a string regardless
      scrollSepolia: 'abc',
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
    ],
  },
};

export default config;
