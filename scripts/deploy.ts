import { ethers } from 'hardhat';
import { addPoolToChef, addRewardToken, createPool, createPosition,
  deployPoolFactory, deployRamsey, deployRewardManager, deployYieldBooster, 
  getERC20WithSigner, getTokenBalance, sleepWait, updateRewardToken,
} from './utils';
import {
  ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT, NFT_POOL_FACTORY,
  OLD_CHEF_RAMSEY_ADDRESS, POOLS, xARX_ADDRESS,
} from './constants';
import { Contract } from 'ethers';
import { MAX_UINT256, ONE_DAY_SECONDS } from '../test/constants';
import { xPools } from './xPools';
import { getNFTPool } from '../test/utils';
import { runAddPoolFlow } from './utils2';

export const FACTORY = '0x3157e5aD383C36f2A27Fbc0aC2dB09Ef723ff80E';
export const TREASURY = '0xE8FFE751deA181025a9ACf3D6Bde8cdA5380F53F'; 
export const REWARD_MANAGER = '';
const FRAX_WETH = '0xde553150ef951800d2c85b06ee3012113d7a262f'; // PID 41
const FRXETH_FRAX = ''; // PID 42
const FRXETH_WETH = ''; // PID 43

async function main() {
  const signer = (await ethers.getSigners())[0];
  await runAddPoolFlow(
    FRAX_WETH, 
    TREASURY, 
    FACTORY,
    signer
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

