import { ethers } from 'hardhat';
import {
  addPoolToChef,
  addRewardToken,
  createPool,
  deployPoolFactory,
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

const BOOST = '0x06EE396734101741f5cc964349C85a0D60c63d89';
const RAMSEY = '0x455AA6c27BF44060A967364673C326fB2EcEd15B';
const FACTORY = '0x4973aFa3344a6b4c3c352b6c93115aD97f7fB12a';
const ARX_USDC_NFTPOOL = '0xe1e99841Ea929671f403B219e9Eb75d69944A6d5';
const ARX_USDC_NFTPOOL_MANAGER = '0xc4E3b4690273ca3f482a4FeEc47F7d6b68aF927e';

async function main() {
  const signer = (await ethers.getSigners())[0];
  //
  // await runAddPoolFlow(xPools.WETH_USDC.lpPoolAddress, ARBIDEX_TREASURY, NFT_POOL_FACTORY, CHEF_RAMSEY_ADDRESS);
  await addRewardToken(ARX_USDC_NFTPOOL_MANAGER, USDC, parseUnits('0.0001'), signer);
  //

  // await addPoolToChef(xPools.ARX_USDC.nftPoolAddress, xPools.ARX_USDC.initialChefAllocationPoints);
  // await createPool(NFT_POOL_FACTORY, POOLS.WETH_USDC);
  // await addPoolToChef(xPools.WETH_USDC.nftPoolAddress, xPools.WETH_USDC.initialChefAllocationPoints);
  // const yieldBooster = await deployYieldBooster(xARX_ADDRESS);
  // const chefRamsey = await deployRamsey(yieldBooster.address, signer);
  // const chefRamsey = await ethers.getContractAt('ChefRamsey', RAMSEY);
  // const oldRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);
  // oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS);
  // const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);
  // await dummyToken.approve(chefRamsey.address, MAX_UINT256);
  // await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);
  // const factory = await deployPoolFactory(chefRamsey.address, ARX_ADDRESS, xARX_ADDRESS);
  // const rewardManager = await deployRewardManager();
  // const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;
  // const nftPoolAddress = await createPool(factory.address, lpPoolAddress, rewardManager.address);
  // const nftPoolAddress = ARX_USDC_NFTPOOL;
  // await rewardManager.initialize(nftPoolAddress);
  // Need rewardManager init before creating positions
  // await chefRamsey.add(nftPoolAddress, 1000, true);
  // // If wanting to test a deposit right away:
  // const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  // await lpInstance.approve(nftPool.address, MAX_UINT256);
  // const lpBalance = await getTokenBalance(lpPoolAddress, signer.address, signer);
  // const nftPool = getNFTPool(nftPoolAddress, signer);
  // await nftPool.createPosition(lpBalance, 0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
