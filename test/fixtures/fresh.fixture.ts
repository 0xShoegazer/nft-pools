import { ethers } from 'hardhat';
import {
  approveTokens,
  createPool,
  createPosition,
  deployPoolFactory,
  deployRamsey,
  deployRewardManager,
  deployYieldBooster,
  getERC20WithSigner,
  getTokenBalance,
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
import { MAX_UINT256, UNIV2_POOL_BALANCEOF_SLOT } from '../constants';
import { xPools } from '../../scripts/xPools';
import { getNFTPool, giveTokenBalanceFor } from '../utils';
import { parseUnits } from 'ethers/lib/utils';

export async function freshFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);

  // Test LP pool
  const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;

  // Setup account funds
  await giveTokenBalanceFor(
    ethers.provider,
    lpPoolAddress,
    signer.address,
    UNIV2_POOL_BALANCEOF_SLOT,
    parseUnits('100')
  );
  const lpBalance = await getTokenBalance(lpPoolAddress, signer.address, signer);

  const oldRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);

  const yieldBooster = await deployYieldBooster(xARX_ADDRESS);
  const chefRamsey = await deployRamsey(yieldBooster.address, signer);
  const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);
  const mainChef = new Contract(ARBIDEX_CHEF_ADDRESS, OLD_CHEF_ABI, signer);

  // Migration flow
  const [, , factory, rewardManager] = await Promise.all([
    oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS as any),
    dummyToken.approve(chefRamsey.address, MAX_UINT256),
    deployPoolFactory(chefRamsey.address, ARX_ADDRESS, xARX_ADDRESS),
    deployRewardManager(),
    ,
  ]);

  await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);

  const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address);
  await rewardManager.initialize(nftPoolAddress);

  // Need rewardManager init before creating positions
  const nftPool = getNFTPool(nftPoolAddress, signer);
  await chefRamsey.add(nftPoolAddress, 10000, true);

  const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  await lpInstance.approve(nftPool.address, MAX_UINT256);

  // await createPosition(nftPoolAddress, lpPoolAddress, lpBalance, signer);
  await nftPool.createPosition(lpBalance, 0);
  const tokenId = 1;

  return {
    chefRamsey,
    oldRamsey,
    dummyToken,
    signer,
    mainChef,
    factory,
    nftPool,
    yieldBooster,
    tokenId,
    rewardManager,
  };
}
