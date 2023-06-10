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
  ARX_USDC_NFTPOOL,
  ARX_USDC_NFTPOOL_MANAGER,
  CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT,
  YEILD_BOOST_ADDRESS,
  xARX_ADDRESS,
} from '../../scripts/constants';
import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';
import { Contract } from 'ethers';
import { OLD_CHEF_ABI } from '../abis/arbidex-chef-abi';
import { getNFTPool } from '../utils';
import { XTOKEN_ABI } from '../abis/xtoken-abi';

export async function liveItemsFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);

  const yieldBooster = await ethers.getContractAt('YieldBooster', YEILD_BOOST_ADDRESS, signer);
  const chefRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);
  const xToken = await ethers.getContractAt(XTOKEN_ABI, xARX_ADDRESS, signer);

  // Need rewardManager init before creating positions
  const nftPool = getNFTPool(ARX_USDC_NFTPOOL, signer);
  const rewardManager = await ethers.getContractAt('NFTPoolRewardManager', ARX_USDC_NFTPOOL_MANAGER, signer);
  const tokenId = 1;
  const mainChef = new Contract(ARBIDEX_CHEF_ADDRESS, OLD_CHEF_ABI, signer);

  return {
    chefRamsey,
    signer,
    mainChef,
    nftPool,
    yieldBooster,
    tokenId,
    rewardManager,
    xToken,
  };
}
