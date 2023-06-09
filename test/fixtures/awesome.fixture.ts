import { ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from '../../scripts/constants';
import { ethers } from 'hardhat';
import {
  addRewardToken,
  approveTokens,
  createPool,
  createPosition,
  deployPoolFactory,
  deployRewardManager,
  getERC20,
  getERC20WithSigner,
  getTokenAllowance,
  getTokenBalance,
} from '../../scripts/utils';
import { xPools } from '../../scripts/xPools';
import { RAMSEY_ABI } from '../abis/chef-ramsey-abi';
import { Contract } from 'ethers';
import { WBTC } from '../../scripts/token';
import { parseUnits } from 'ethers/lib/utils';
import { getNFTPool, giveTokenBalanceFor } from '../utils';
import { MAX_UINT256, UNIV2_POOL_BALANCEOF_SLOT } from '../constants';
import { impersonateAccount, setBalance } from '@nomicfoundation/hardhat-network-helpers';

export async function awesomeFixture() {
  // Impersonate treasury for simplicity
  await impersonateAccount(ARBIDEX_TREASURY);
  const signer = await ethers.getSigner(ARBIDEX_TREASURY);
  await setBalance(ARBIDEX_TREASURY, parseUnits('10000'));

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
  const lpBalance = await getTokenBalance(lpPoolAddress, signer.address);

  // Pool creation setup
  const rewardManager = await deployRewardManager();
  const factory = await deployPoolFactory(CHEF_RAMSEY_ADDRESS, ARX_ADDRESS, xARX_ADDRESS);
  const nftPoolAddress: string = await createPool(factory.address, lpPoolAddress, rewardManager.address);
  // Needs pool address for init
  await rewardManager.initialize(nftPoolAddress);

  // Add new pool to chef
  const chefRamsey = new Contract(CHEF_RAMSEY_ADDRESS, RAMSEY_ABI, signer);
  await chefRamsey.add(nftPoolAddress, 500, true);

  const nftPool = getNFTPool(nftPoolAddress, signer);
  const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  await lpInstance.approve(nftPool.address, MAX_UINT256);

  await nftPool.createPosition(lpBalance.div(2), 0);

  await addRewardToken(rewardManager.address, WBTC, parseUnits('0.01'));

  return {
    factory,
    nftPoolAddress,
    signer,
    nftPool,
    chefRamsey,
    rewardToken: await getERC20WithSigner(WBTC, signer),
    tokenId: 1,
  };
}
