import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';

dotenv.config();

const accounts = process.env.DEV_KEY !== undefined ? [process.env.DEV_KEY] : [];

const config = {
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          // evmVersion: 'london',
          optimizer: {
            enabled: true,
            runs: 2500,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.BASE_RPC || '',
        blockNumber: 9925339, // 1/30 1:30PM
      },
      // loggingEnabled: true,
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
      url: process.env.BASE_RPC || '',
      accounts,
      chainId: 8453,
      // gas: 500000,
      // gasPrice: 100,
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC,
      accounts,
      chainId: 84531,
      // gas: 500000,
      // gasPrice: 100,
    },
    mode: {
      url: process.env.MODE_RPC,
      accounts,
      chainId: 34443,
    },
    modeTestnet: {
      url: 'https://sepolia.mode.network',
      accounts,
      chainId: 919,
      // gas: 500000,
      // gasPrice: 10,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
};

export default config;
