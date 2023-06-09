import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

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
            runs: 1500,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ARBITRUM_RPC || '',
        blockNumber: 98488993,
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
  },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
