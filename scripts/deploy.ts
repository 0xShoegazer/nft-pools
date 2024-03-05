import { ethers } from 'hardhat';
import { ARBIDEX_TREASURY, NFT_POOL_FACTORY } from './constants';
import { runAddPoolFlow } from './utils2';
import { deployRewardManager } from './utils';

async function main() {
  const signer = (await ethers.getSigners())[0];

  // await runAddPoolFlow(depositToken, ARBIDEX_TREASURY, NFT_POOL_FACTORY, signer);
  // const rewardManager = await deployRewardManager(ARBIDEX_TREASURY, signer);

  // const rewardManager = await ethers.getContractAt('PoolRewardManager', '0x61cD9a2c3DE71f1aC514941BaC5F08520F8469b3');
  // console.log(await rewardManager.poolAddress());
  //  console.log('Initializing reward manager..');
  // await rewardManager.initializePool('0xA05a3ba7d2Ea7b3F67874b96775B30BbE37013C7');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
