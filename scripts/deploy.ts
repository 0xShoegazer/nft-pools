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

/**
 * FINAL SHOW
 */

export const FACTORY_DEEZ = '0xD116fbfF78Eb7109B7C4eC93f76520aB67Da3Ea2';

// other repo
export const BOOST_DEEZ = '0xE4245fEdF254141E00d8A4fFF42Dce306021746D';
export const MASTER_CHEF = '0xe925B12Bdf074B0A17E42F2C3d60BBfC40063C5a';

export const REWARD_MANAGER = '';

// LP's
const FRAX_USDPLUS = '0xb0Fb1787238879171Edc30b9730968600D55762A'; // pid 34
const FRAX_DAIPLUS = '0x306132b6147751B85E608B4C1EC452E111531eA2'; // pid 35
const USDC_USDCE = '0x81e8be7795ed3d8619f037b8db8c80292332aa72'; // PID 36
const WETH_USDC = '0x1bde4a91d0ff7a353b511186768f4cc070874556'; // PID 37

async function main() {
  // await runLocal();
  //
  const signer = (await ethers.getSigners())[0];
  //
  // The flow
  // const oldRamsey = await ethers.getContractAt('ChefRamsey', OLD_CHEF_RAMSEY_ADDRESS, signer);
  // oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS);
  // const yieldBooster = await deployYieldBooster(xARX_ADDRESS);
  // await sleepWait();
  // const chefRamsey = await deployRamsey(ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, BOOST, signer);
  // await sleepWait();
  // const chefRamsey = await ethers.getContractAt('ChefRamsey', RAMSEY, signer);
  // const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);
  // await dummyToken.approve(chefRamsey.address, MAX_UINT256);
  // await sleepWait();
  // console.log('Starting Ramsey..')
  // await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);
  // await sleepWait();

  const factory = await deployPoolFactory(MASTER_CHEF, ARX_ADDRESS, xARX_ADDRESS, signer);

  // await sleepWait();

  // await runAddPoolFlow(
  //   xPools.ARX_USDC.lpPoolAddress,
  //   ARBIDEX_TREASURY,
  //   factory.address,
  //   chefRamsey.address,
  //   xPools.ARX_USDC.initialChefAllocationPoints,
  //   signer
  // );

  // await sleepWait();

  // await runAddPoolFlow(
  //   xPools.WETH_USDC.lpPoolAddress,
  //   ARBIDEX_TREASURY,
  //   factory.address,
  //   chefRamsey.address,
  //   xPools.WETH_USDC.initialChefAllocationPoints,
  //   signer
  // );

  // await addRewardToken(ARX_USDC_NFTPOOL_MANAGER, USDC, parseUnits('0.01'), signer);
}

async function runLocal() {
  // const signer = (await ethers.getSigners())[0];

  // await impersonateAccount(ARBIDEX_TREASURY);
  // const treasurySigner = await ethers.getSigner(ARBIDEX_TREASURY);

  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);

  const factoryAddress = '0xe16b3F364cA0cC858B8b77C6dc2eE3C87feCa528';
  const chef = '0x978B17Dd18AeD505bBa51D0D6Db7c2fe1ac1E98C';
  const willBePoolId = 34;

  const arxPoolAddress = '0x2501C741CEfD2ab62B5e69AC8D0dC97C9181Ab2b';
  const arxRewardManager = '0xfA276dBe0076f468307bd8881622cf8Ee016a26b';
  const wethPoolAddress = '0xf247B8adc142dD72f247Ff26f772a6DE767F5f7C';
  const wethManager = '0x003B4af2D98af1a2700Ea1a1EBB366fE777bD05f';

  // // // local host chef
  // // const factory = await deployPoolFactory(chef, ARX_ADDRESS, xARX_ADDRESS, treasurySigner);
  // const factory = await ethers.getContractAt('NFTPoolFactory', factoryAddress, treasurySigner);
  // const rewardManager = await deployRewardManager(ARBIDEX_TREASURY, treasurySigner);
  // const nftPoolAddress = await createPool(
  //   factory.address,
  //   xPools.ARX_USDC.lpPoolAddress,
  //   rewardManager.address,
  //   treasurySigner
  // );

  // await rewardManager.initializePool(nftPoolAddress);

  // // // const manager = await ethers.getContractAt('PoolRewardManager', rewardManager, treasurySigner);

  // // add to new chef
  // const arxAlloc = 4500;
  // const wethAlloc = 1000;
  // const masterChef = await getMasterChef(chef, treasurySigner);
  // await masterChef.add(nftPoolAddress, arxAlloc, wethAlloc, true);
  // console.log('New pool added to master chef');
  //
  // test adding token
  // await addRewardToken(wethManager, USDC, parseUnits('0.01'), treasurySigner);

  // await createPosition(arxPoolAddress, xPools.ARX_USDC.lpPoolAddress, parseUnits('0.000001'), signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
