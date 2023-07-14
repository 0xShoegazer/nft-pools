import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-contract-sizer';

dotenv.config();

const accounts = process.env.DEV_KEY !== undefined ? [process.env.DEV_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  contractSizer: {
    // override defaults as needed: https://www.npmjs.com/package/hardhat-contract-sizer
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
  networks: {
    hardhat: {
      forking: {
        url: process.env.ARBITRUM_RPC || '',
        blockNumber: 97443294,
      },
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
      url: `https://developer-access-mainnet.base.org/`,
      accounts,
      gasPrice: 2500000000,
    },
    bsc: {
      url: process.env.BSC_RPC || '',
      accounts,
    },
  },
};

export default config;
