import { ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from '../../scripts/constants';
import { ethers } from 'hardhat';
import { createPool, deployPoolFactory, deployRewardManager } from '../../scripts/utils';
import { xPools } from '../../scripts/xPools';
import { getNFTPool } from '../utils';
import { RAMSEY_ABI } from '../abis/chef-ramsey-abi';
import { Contract } from 'ethers';

export async function awesomeFixture() {
  const signer = await ethers.getSigner(ARBIDEX_TREASURY);

  const rewardManager = await deployRewardManager();
  const factory = await deployPoolFactory(CHEF_RAMSEY_ADDRESS, ARX_ADDRESS, xARX_ADDRESS);
  const poolAddress: string = await createPool(factory.address, xPools.ARX_USDC.lpPoolAddress, rewardManager.address);
  const arxTestPool = getNFTPool(poolAddress, signer);
  const chefRamsey = new Contract(CHEF_RAMSEY_ADDRESS, RAMSEY_ABI, signer);

  return {
    factory,
    poolAddress,
    signer,
    arxTestPool,
    chefRamsey,
  };
}
