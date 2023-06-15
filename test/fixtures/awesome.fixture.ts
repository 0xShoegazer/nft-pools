import {
  ARBIDEX_CHEF_ADDRESS,
  ARBIDEX_TREASURY,
  ARX_ADDRESS,
  DEV_ACCOUNT,
  xARX_ADDRESS,
} from '../../scripts/constants';
import { ethers } from 'hardhat';
import {
  createPool,
  deployGlobalRewardManager,
  deployPoolFactory,
  deployRamsey,
  deployRewardManager,
  deployYieldBooster,
  getERC20WithSigner,
} from '../../scripts/utils';
import { xPools } from '../../scripts/xPools';
import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { getNFTPool, giveTokenBalanceFor } from '../utils';
import { MAX_UINT256, UNIV2_POOL_BALANCEOF_SLOT } from '../constants';
import { impersonateAccount, setBalance } from '@nomicfoundation/hardhat-network-helpers';
import { OLD_CHEF_ABI } from '../abis/arbidex-chef-abi';

export async function awesomeFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);
  await setBalance(DEV_ACCOUNT, parseUnits('10000'));

  // Test LP pool
  const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;
  const userOneLpBalance = parseUnits('100');
  // Setup account funds
  await giveTokenBalanceFor(
    ethers.provider,
    lpPoolAddress,
    signer.address,
    UNIV2_POOL_BALANCEOF_SLOT,
    userOneLpBalance
  );

  const randomAccount = (await ethers.getSigners())[2];
  const yieldBoooster = await deployYieldBooster(xARX_ADDRESS);
  const chefRamsey = await deployRamsey(ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, yieldBoooster.address, signer);

  // Pool creation setup
  const rewardManager = await deployRewardManager(ARBIDEX_TREASURY, signer);
  const factory = await deployPoolFactory(chefRamsey.address, ARX_ADDRESS, xARX_ADDRESS, signer);
  const nftPoolAddress: string = await createPool(factory.address, lpPoolAddress, rewardManager.address, signer);

  // await rewardManager.addPool(nftPoolAddress);
  // Add new pool to chef
  await chefRamsey.add(nftPoolAddress, 1, true);

  const nftPool = getNFTPool(nftPoolAddress, signer);
  const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  await lpInstance.approve(nftPool.address, MAX_UINT256);

  // const lpBalance = await getTokenBalance(lpPoolAddress, signer.address, signer);
  await nftPool.createPosition(userOneLpBalance.div(2), 0);
  const lpBalanceRandomAccount = userOneLpBalance.div(2);
  await lpInstance.transfer(randomAccount.address, lpBalanceRandomAccount);

  return {
    factory,
    nftPoolAddress,
    signer,
    nftPool,
    chefRamsey,
    tokenId: 1,
    ARXToken: await getERC20WithSigner(ARX_ADDRESS, signer),
    xARXToken: await getERC20WithSigner(xARX_ADDRESS, signer),
    oldChef: new Contract(ARBIDEX_CHEF_ADDRESS, OLD_CHEF_ABI, signer),
    rewardManager,
    randomAccount,
    lpBalanceRandomAccount,
    lpInstance,
  };
}
