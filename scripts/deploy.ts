import { ethers } from 'hardhat';
import { ARBIDEX_TREASURY, NFT_POOL_FACTORY } from './constants';
import { runAddPoolFlow } from './utils2';

async function main() {
  const signer = (await ethers.getSigners())[0];

  const depositToken = '0x05281948a2897d1a4a2e3a22889dc44aeb518669'; // UND-DAI strat LP
  const allocARX = 0;
  const allocPointsWETH = 0;
  await runAddPoolFlow(depositToken, ARBIDEX_TREASURY, NFT_POOL_FACTORY, signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
