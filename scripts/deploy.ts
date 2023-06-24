import { ethers } from 'hardhat';
import { addPoolToChef, addRewardToken, createPool, createPosition,
  deployPoolFactory, deployRamsey, deployRewardManager, deployYieldBooster, 
  getERC20WithSigner, getTokenBalance, sleepWait, updateRewardToken,
} from './utils';
import {
  ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT, DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS, NFT_POOL_FACTORY,
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
const FRAX_WETH = '0x4f3867358a4C16Fa8f71c9c4D5C87bc7B8837cd2'; // PID 38 
const FRXETH_FRAX = '0x1BcF25125343D68B1b938fACA4B993E82549612D'; // PID 39 
const FRXETH_WETH = '0x76678C984b56371767aDa0f5261D5a4b6B6536EE'; // PID 40 

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

