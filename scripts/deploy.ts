import { ethers } from 'hardhat';
import { addPoolToChef, createPool, deployPoolFactory, deployYieldBooster } from './utils';
import {
  ARX_ADDRESS,
  CHEF_RAMSEY_ADDRESS,
  DUMMY_POOL_ID,
  DUMMY_TOKEN_ADDRESS,
  NFT_POOL_FACTORY,
  POOLS,
  xARX_ADDRESS,
} from './constants';
import { ARBIDEX_CHEF_ADDRESS } from './constants';
import { Contract } from 'ethers';
import { MAX_UINT256 } from '../test/constants';
import { xPools } from './xPools';

async function main() {
  // const signer = (await ethers.getSigners())[0];
  // await deployYieldBooster(xARX_ADDRESS);
  // await deployPoolFactory(CHEF_RAMSEY_ADDRESS, ARX_ADDRESS, xARX_ADDRESS);

  //await createPool(NFT_POOL_FACTORY, POOLS.ARX_USDC);
  await addPoolToChef(xPools.ARX_USDC.nftPoolAddress, xPools.ARX_USDC.initialChefAllocationPoints);
  // await createPool(NFT_POOL_FACTORY, POOLS.WETH_USDC);
  // await addPoolToChef(xPools.WETH_USDC.nftPoolAddress, xPools.WETH_USDC.initialChefAllocationPoints);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
