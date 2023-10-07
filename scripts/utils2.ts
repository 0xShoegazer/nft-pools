import { ethers } from 'hardhat';
import { createPool, deployRewardManager, sleepWait } from './utils';

export async function runAddPoolFlow(lpPoolAddress: string, treasury: string, poolFactory: string, signer) {
  const factory = await ethers.getContractAt('NFTPoolFactory', poolFactory, signer);

  console.log('Deploying pool reward manager..');
  const rewardManager = await deployRewardManager(treasury, signer);
  await sleepWait();
  console.log('Creating new NFTPool..');
  const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address, signer);
  await sleepWait();
  console.log('Initializing reward manager..');
  await rewardManager.initializePool(nftPoolAddress);
  await sleepWait();
}
