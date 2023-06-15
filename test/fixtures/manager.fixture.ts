import { ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, DEV_ACCOUNT, xARX_ADDRESS } from '../../scripts/constants';
import { ethers } from 'hardhat';
import { createPool, deployGlobalRewardManager, deployPoolFactory, getERC20WithSigner } from '../../scripts/utils';
import { xPools } from '../../scripts/xPools';
import { Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { getNFTPool, giveTokenBalanceFor } from '../utils';
import { ADMIN_ROLE_HASH, MAX_UINT256, OPERATOR_ROLE_HASH, UNIV2_POOL_BALANCEOF_SLOT } from '../constants';
import { impersonateAccount, setBalance, stopImpersonatingAccount } from '@nomicfoundation/hardhat-network-helpers';
import { getMasterChef, getPoolLivePoolFactory } from '../../scripts/contract.utils';

export async function managerFixture() {
  await impersonateAccount(ARBIDEX_TREASURY);
  let signer = await ethers.getSigner(ARBIDEX_TREASURY);
  await setBalance(ARBIDEX_TREASURY, parseUnits('10000'));
  // await impersonateAccount(DEV_ACCOUNT);
  // let signer = await ethers.getSigner(DEV_ACCOUNT);

  // // Real life scenario here
  const masterChef = await getMasterChef(signer);
  // await masterChef.transferOwnership(ARBIDEX_TREASURY);
  // await stopImpersonatingAccount(DEV_ACCOUNT);

  // switch to treasury
  // await impersonateAccount(ARBIDEX_TREASURY);
  // signer = await ethers.getSigner(ARBIDEX_TREASURY);
  // await setBalance(ARBIDEX_TREASURY, parseUnits('10000'));

  const factory = await deployPoolFactory(masterChef.address, ARX_ADDRESS, xARX_ADDRESS, signer);

  const globalRewardManager = await deployGlobalRewardManager(ARBIDEX_TREASURY, signer);

  // Allow factory to add pools (only action this role can perform)
  await globalRewardManager.grantRole(OPERATOR_ROLE_HASH, factory.address);

  // // Test LP pool
  const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;

  // factory will add pool to global reward manager
  // const nftPoolAddress: string = await createPool(factory.address, lpPoolAddress, globalRewardManager.address, signer);
  // console.log('nftPoolAddress: ' + nftPoolAddress);

  // Add new pool to chef
  // await masterChef.add(nftPoolAddress, 100, true);

  // const nftPool = getNFTPool(nftPoolAddress, signer);
  // const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  // await lpInstance.approve(nftPool.address, MAX_UINT256);

  // const userOneLpBalance = parseUnits('100');
  // // Setup account funds
  // await giveTokenBalanceFor(
  //   ethers.provider,
  //   lpPoolAddress,
  //   signer.address,
  //   UNIV2_POOL_BALANCEOF_SLOT,
  //   userOneLpBalance
  // );

  // await nftPool.createPosition(userOneLpBalance.div(2), 0);

  // const randomAccount = (await ethers.getSigners())[2];
  // const lpBalanceRandomAccount = userOneLpBalance.div(2);
  // await lpInstance.transfer(randomAccount.address, lpBalanceRandomAccount);

  return {
    // masterChef,
    // tokenId: 1,
    // randomAccount,
    // lpBalanceRandomAccount,
    // lpInstance,
    signer,
    // nftPool,
    // userOneLpBalance,
    lpPoolAddress,
    factory,
    globalRewardManager,
  };
}
