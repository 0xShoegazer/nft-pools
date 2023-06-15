import { ethers } from 'hardhat';
import { FACTORY_DEEZ, MASTER_CHEF } from './deploy';
import { MASTER_CHEF_ABI } from './abis/master-chef';

export async function getMasterChef(signer) {
  return ethers.getContractAt(MASTER_CHEF_ABI, MASTER_CHEF, signer);
}

export async function getPoolLivePoolFactory(signer) {
  return ethers.getContractAt('NFTPoolFactory', FACTORY_DEEZ, signer);
}
