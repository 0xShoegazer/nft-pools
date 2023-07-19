import { ethers } from 'hardhat';
import {
  addPoolToChef,
  addRewardToken,
  createPool,
  createPosition,
  deployPoolFactory,
  deployRamsey,
  deployRewardManager,
  deployYieldBooster,
  getERC20WithSigner,
  getTokenBalance,
  sleepWait,
  updateRewardToken,
} from './utils';
import {
  ARBIDEX_TREASURY,
  ARX_ADDRESS,
  CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT,
  DUMMY_POOL_ID,
  DUMMY_TOKEN_ADDRESS,
  NFT_POOL_FACTORY,
  OLD_CHEF_RAMSEY_ADDRESS,
  POOLS,
  xARX_ADDRESS,
} from './constants';
import { ARBIDEX_CHEF_ADDRESS } from './constants';
import { Contract } from 'ethers';
import { MAX_UINT256, ONE_DAY_SECONDS } from '../test/constants';
import { xPools } from './xPools';
import { getNFTPool } from '../test/utils';
import { runAddPoolFlow } from './utils2';
import { USDC } from './token';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { getMasterChef } from './contract.utils';
import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';

// const OLD_BOOST = '0x06EE396734101741f5cc964349C85a0D60c63d89';
// const OLD_RAMSEY = '0x455AA6c27BF44060A967364673C326fB2EcEd15B';
// const OLD_FACTORY = '0x4973aFa3344a6b4c3c352b6c93115aD97f7fB12a';
// const OLD_ARX_USDC_NFTPOOL = '0xe1e99841Ea929671f403B219e9Eb75d69944A6d5';
// const OLD_ARX_USDC_NFTPOOL_MANAGER = '0xc4E3b4690273ca3f482a4FeEc47F7d6b68aF927e';

const BOOST = '0xE4245fEdF254141E00d8A4fFF42Dce306021746D';
const RAMSEY = '0x6f3dc1DB0635a320e6ca4572273b496B9775822C';
const FACTORY = '0xD5398976eBf2573d553229fBC5841Ff1975A9c49';
const ARX_USDC_NFTPOOL = '0x3C2E1eD5996BFaC1104D9ef1d61EA9f7D75D48F4';
const ARX_USDC_NFTPOOL_MANAGER = '0xafC80d286713706297f01aE5c1DeD28683df826d';

const WETH_USDC_NFTPOOL = '0xB98ced1fab671Ac55562F28d0E40af0BDDeE4065';
const WETH_USDC_REWARD_MANAGER = '0xcA7ea1d7B85B984aF228D7210ba7B9e9b8cBEDcb';

export const FACTORY_DEEZ = '0xD116fbfF78Eb7109B7C4eC93f76520aB67Da3Ea2';

// other repo
export const BOOST_DEEZ = '0xE4245fEdF254141E00d8A4fFF42Dce306021746D';
export const MASTER_CHEF = '0xe925B12Bdf074B0A17E42F2C3d60BBfC40063C5a';

export const REWARD_MANAGER = '';

async function main() {
  const signer = (await ethers.getSigners())[0];

  const factory = await deployPoolFactory(MASTER_CHEF, ARX_ADDRESS, xARX_ADDRESS, signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
