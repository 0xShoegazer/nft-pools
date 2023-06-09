import { ethers } from 'hardhat';
import {
  createPool,
  deployPoolFactory,
  deployRamsey,
  deployRewardManager,
  getERC20WithSigner,
} from '../../scripts/utils';
import {
  ARBIDEX_CHEF_ADDRESS,
  ARX_ADDRESS,
  CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT,
  DUMMY_POOL_ID,
  DUMMY_TOKEN_ADDRESS,
  xARX_ADDRESS,
} from '../../scripts/constants';
import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';
import { Contract } from 'ethers';
import { OLD_CHEF_ABI } from '../abis/arbidex-chef-abi';
import { MAX_UINT256 } from '../constants';
import { xPools } from '../../scripts/xPools';
import { getNFTPool } from '../utils';

export async function freshFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);

  const oldRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);
  const chefRamsey = await deployRamsey(signer);
  const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);
  const mainChef = new Contract(ARBIDEX_CHEF_ADDRESS, OLD_CHEF_ABI, signer);

  // Migration flow
  const [, , factory, rewardManager] = await Promise.all([
    oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS as any),
    dummyToken.approve(chefRamsey.address, MAX_UINT256),
    deployPoolFactory(chefRamsey.address, ARX_ADDRESS, xARX_ADDRESS),
    deployRewardManager(),
  ]);

  await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);

  // Test LP pool
  const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;

  const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address);
  const nftPool = getNFTPool(nftPoolAddress, signer);

  await rewardManager.initialize(nftPoolAddress);

  return {
    chefRamsey,
    oldRamsey,
    dummyToken,
    signer,
    mainChef,
    factory,
    nftPool,
  };
}
