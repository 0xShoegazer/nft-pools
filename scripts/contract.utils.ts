import { ethers } from 'hardhat';
import { FACTORY_DEEZ, MASTER_CHEF } from './deploy';
import { MASTER_CHEF_ABI } from './abis/master-chef';

export async function getMasterChef(chef: string, signer) {
  return ethers.getContractAt(MASTER_CHEF_ABI, chef, signer);
}

export async function getPoolLivePoolFactory(signer) {
  return ethers.getContractAt('NFTPoolFactory', FACTORY_DEEZ, signer);
}
