import { ethers } from 'hardhat';
import {
  addPoolToChef,
  addRewardToken,
  createPool,
  deployPoolFactory,
  deployPoolRewardManagerUpgradeable,
  deployRamsey,
  deployRewardManager,
  deployYieldBooster,
  getERC20WithSigner,
  getTokenBalance,
  sleepWait,
} from './utils';
import {
  ARBIDEX_TREASURY,
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
import { getNFTPool } from '../test/utils';
import { runAddPoolFlow } from './utils2';
import { USDC } from './token';
import { parseUnits } from 'ethers/lib/utils';

// const OLD_BOOST = '0x06EE396734101741f5cc964349C85a0D60c63d89';
// const OLD_RAMSEY = '0x455AA6c27BF44060A967364673C326fB2EcEd15B';
// const OLD_FACTORY = '0x4973aFa3344a6b4c3c352b6c93115aD97f7fB12a';
// const OLD_ARX_USDC_NFTPOOL = '0xe1e99841Ea929671f403B219e9Eb75d69944A6d5';
// const OLD_ARX_USDC_NFTPOOL_MANAGER = '0xc4E3b4690273ca3f482a4FeEc47F7d6b68aF927e';

const BOOST = '0x86AC5fff31c84dC9Ba4D824A5108F2a4b6C9814F';
const RAMSEY = '0xc82E22A6fe051b8130916bebB09178c589Dc2257';
const FACTORY = '0x5aEABA6F05C5879dF2F90fCC6780177ac13DD747';
const ARX_USDC_NFTPOOL = '0x9C3330AaA41B2741E80ebF6a3d00c33996A6c7b0';
const ARX_USDC_NFTPOOL_MANAGER = '0x15fa42F318a0D123fce04B747DE6DF9B122Cc107';

const WETH_USDC_NFTPOOL = '0x35602b2C36D61A1D7Fe52ced73fe850798E5E18D';
const WETH_USDC_REWARD_MANAGER = '0x2f726704b8dCE14e6eB198EF1a4AcdBB63B85F05';

async function main() {
  const signer = (await ethers.getSigners())[0];
  //
  // await runAddPoolFlow(xPools.WETH_USDC.lpPoolAddress, ARBIDEX_TREASURY, NFT_POOL_FACTORY, CHEF_RAMSEY_ADDRESS);
  // await addRewardToken(ARX_USDC_NFTPOOL_MANAGER, USDC, parseUnits('0.0001'), signer);
  //

  // const yieldBooster = await deployYieldBooster(xARX_ADDRESS);
  // const chefRamsey = await deployRamsey(yieldBooster.address, signer);
  // const chefRamsey = await ethers.getContractAt('ChefRamsey', RAMSEY);
  // const oldRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);
  // oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS);
  // const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);
  // await dummyToken.approve(chefRamsey.address, MAX_UINT256);
  // await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);
  // const factory = await deployPoolFactory(chefRamsey.address, ARX_ADDRESS, xARX_ADDRESS);
  // await sleepWait();
  // const rewardManager = await deployPoolRewardManagerUpgradeable(ARBIDEX_TREASURY, signer);
  // await sleepWait();
  // const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;
  // const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address, signer);
  // const rewardManager = await ethers.getContractAt('PoolRewardManager', ARX_USDC_NFTPOOL_MANAGER, signer);
  // const nftPoolAddress = ARX_USDC_NFTPOOL;
  // await rewardManager.initializePool(nftPoolAddress);
  // await sleepWait();
  // // Need rewardManager init before creating positions
  // console.log('Adding pool to chef..');
  // await chefRamsey.add(nftPoolAddress, 1000, true);

  // const wethUsdcRewardManager = await deployPoolRewardManagerUpgradeable(ARBIDEX_TREASURY, signer);
  // await sleepWait();
  // const wethUsdcPoolAddress = await createPool(
  //   FACTORY,
  //   xPools.WETH_USDC.lpPoolAddress,
  //   wethUsdcRewardManager.address,
  //   signer
  // );
  // await sleepWait();
  // Need rewardManager init before creating positions
  // console.log('Adding pool to chef..');
  // await chefRamsey.add(WETH_USDC_NFTPOOL, 1000, true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
