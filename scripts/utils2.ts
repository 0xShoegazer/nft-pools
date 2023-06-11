import { ethers } from 'hardhat';
import { createPool, deployRewardManager, sleepWait } from './utils';

export async function runAddPoolFlow(lpPoolAddress: string, treasury: string, poolFactory: string, chef: string) {
  const signer = (await ethers.getSigners())[0];

  const factory = await ethers.getContractAt('NFTPoolFactory', poolFactory, signer);
  const chefRamsey = await ethers.getContractAt('ChefRamsey', chef, signer);

  console.log('Deploying pool reward manager..');
  const rewardManager = await deployRewardManager(treasury);
  await sleepWait();
  console.log('Creating new NFTPool..');
  const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address, signer);
  await sleepWait();
  console.log('Initializing reward manager..');
  await rewardManager.initialize(nftPoolAddress);
  await sleepWait();
  // Need rewardManager init before creating positions
  console.log('Adding pool to chef..');
  await chefRamsey.add(nftPoolAddress, 500, true);
}
