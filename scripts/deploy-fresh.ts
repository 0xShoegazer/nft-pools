import { ethers } from 'hardhat';
import { deployPoolFactory } from './utils';
import { ARBIDEX_TREASURY, ARX_ADDRESS, xARX_ADDRESS } from './constants';
import { runAddPoolFlow } from './utils2';

const NEW_CHEF = '0x282fdb7A2876Ade5C027061D6FA5D7724AE1b2e5';
const NEW_FACTORY = '0x3157e5aD383C36f2A27Fbc0aC2dB09Ef723ff80E';

// LP's
const ARX_USDC_LP = '0xA6efAE0C9293B4eE340De31022900bA747eaA92D';
const WETH_USDCe_WIDE = '0xcf8ea96ecfdb7800e1eb413bde4af6ce984ab079';
const ARX_ETH_LP = '0x62FdDfC2D4b35aDec79c6082CA2894eAb01aC0db';
const WETH_USDCe_NARROW = '0xa1c443f7ae3cec5a61a163b98461af6dc4a98a90';
const BTC_ETH_LP = '0x8a8d968c9534727118aa02965f16f6d398c14b1d';
const WBTC_USDC_LP = '0x02ebfb3aac7934cdc6877d5ee8cf5e17e449a9a3';
const USDT_USDCe_LP = '0x3fb86a978530d9881627907b428e9ac9c02f9406';
const DAI_USDCe_LP = '0xc4602d1415f32ae23a72ad8cf4371272e25e2f22';
const ARB_USDCe_LP = '0xc1e2eda42ae3b3da68b622f03cd04ff3412467f7';
const ARB_ETH_LP = '0x3369839e15d31b884dbd4e8e101fda0125fb08e8';
const RDNT_WETH_LP = '0xaca4edeee3a98a4311ec4c2a85c92163881f1644';
const FRAX_USDCe_LP = '0x2d3d9D377C046C218e0F3B5A6bD17C9E673F1d8C';
const GNS_WETH = '0xf2d53b528b30f46d08feb20f1524d04d97b614c4';
const USD_PLUS_DAIPLUS_LP = '0xE8C060d40D7Bc96fCd5b758Bd1437C8653400b0e';
const USD_PLUS_USDCe = '0xECe52B1fc32D2B4f22eb45238210b470a64bfDd5';
const DAI_PLUS_DAI_LP = '0xeE5e74Dc56594d070E0827ec270F974A68EBAF22';
const USD_PLUS_ETH = '0xEa5f97aab76E397E4089137345c38b5c4e7939B3';

const FRAX_USD_PLUS = '0xb0Fb1787238879171Edc30b9730968600D55762A'; // pid 34
const FRAX_DAI_PLUS = '0x306132b6147751B85E608B4C1EC452E111531eA2'; // pid 35
const USDC_USDCE = '0x81e8be7795ed3d8619f037b8db8c80292332aa72'; // PID 36
const WETH_USDC = '0x1bde4a91d0ff7a353b511186768f4cc070874556'; // PID 37
const FRAX_WETH = '0xde553150ef951800d2c85b06ee3012113d7a262f'; // PID 41 
const FRXETH_WETH = '0xd3b90a1780b58c59a4333a879c7df488876565f6'; // PID 42
const FRXETH_FRAX = '0x1379Fa99279129476A54108259Da487294D53b97'; // PID 43 

async function main() {
  const signer = (await ethers.getSigners())[0];
  // const factory = await deployPoolFactory(NEW_CHEF, ARX_ADDRESS, xARX_ADDRESS, signer);
  // await sleepWait();
  const LP_ADDRESS = FRXETH_FRAX;
  await runAddPoolFlow(LP_ADDRESS, ARBIDEX_TREASURY, NEW_FACTORY, signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
