import { ethers } from 'hardhat';
import { createPool, deployRewardManager, sleepWait } from './utils';
import { MASTER_CHEF_ABI } from './abis/master-chef';

export async function runAddPoolFlow(
  lpPoolAddress: string,
  treasury: string,
  poolFactory: string,
  chef: string,
  allocPointsARX: number,
  allocPointsWETH: number,
  signer
) {
  const factory = await ethers.getContractAt('NFTPoolFactory', poolFactory, signer);
  const chefRamsey: any = await ethers.getContractAt(MASTER_CHEF_ABI, chef, signer);

  // console.log('Deploying pool reward manager..');
  // const rewardManager = await deployRewardManager(treasury, signer);
  // await sleepWait();
  console.log('Creating new NFTPool..');
  const nftPoolAddress = await createPool(factory.address, lpPoolAddress, signer);
  await sleepWait();
  // console.log('Initializing reward manager..');
  // await rewardManager.initializePool(nftPoolAddress);
  await sleepWait();
  // Need rewardManager init before creating positions
  console.log('Adding pool to chef..');
  await chefRamsey.add(nftPoolAddress, allocPointsARX, allocPointsWETH, true);
}
