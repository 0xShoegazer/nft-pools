import { ethers } from 'hardhat';
import {
  ARBIDEX_TREASURY,
  ARX_ADDRESS,
  CHEF_RAMSEY_ADDRESS,
  DEV_ACCOUNT,
  NFT_POOL_FACTORY,
  xARX_ADDRESS,
} from './constants';
import { runAddPoolFlow } from './utils2';
import { deployPoolFactory } from './utils';

const WETH_USDC_NFTPOOL = '0xB98ced1fab671Ac55562F28d0E40af0BDDeE4065';
const WETH_USDC_REWARD_MANAGER = '0xcA7ea1d7B85B984aF228D7210ba7B9e9b8cBEDcb';

// export const FACTORY_DEEZ = '0xD116fbfF78Eb7109B7C4eC93f76520aB67Da3Ea2';

const ARB_NFT_POOL_FACTORY = ''; // New none rewarder type
const ARB_CHEF_RAMSEY = '0x282fdb7A2876Ade5C027061D6FA5D7724AE1b2e5';

const NITRO_POOL_FACTORY = '0xeC612842F207072877E3078c6670Df64B78e1d7B'; // 1:30PM 7/19/2023

async function main() {
  const signer = (await ethers.getSigners())[0];

  await deployPoolFactory(ARB_CHEF_RAMSEY, ARX_ADDRESS, xARX_ADDRESS, signer);

  // const depositToken = '0xc4f5e98beb552ced70f5d51eb1da599432ca65db'; // DEUS strat address
  // const allocARX = 0;
  // const allocPointsWETH = 0;
  // await runAddPoolFlow(
  //   depositToken,
  //   ARBIDEX_TREASURY,
  //   NFT_POOL_FACTORY,
  //   CHEF_RAMSEY_ADDRESS,
  //   allocARX,
  //   allocPointsWETH,
  //   signer
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
