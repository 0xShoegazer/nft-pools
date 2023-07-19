import { ethers } from 'hardhat';
import { ARBIDEX_TREASURY, CHEF_RAMSEY_ADDRESS, DEV_ACCOUNT, NFT_POOL_FACTORY } from './constants';
import { runAddPoolFlow } from './utils2';

async function main() {
  const signer = (await ethers.getSigners())[0];

  const depositToken = '0xc4f5e98beb552ced70f5d51eb1da599432ca65db'; // DUES strat address
  const allocARX = 0;
  const allocPointsWETH = 0;
  await runAddPoolFlow(
    depositToken,
    ARBIDEX_TREASURY,
    NFT_POOL_FACTORY,
    CHEF_RAMSEY_ADDRESS,
    allocARX,
    allocPointsWETH,
    signer
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
