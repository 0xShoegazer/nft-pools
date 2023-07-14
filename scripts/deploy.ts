import { ethers } from 'hardhat';
import { deployTestProtocolToken, deployTestXToken } from './utils/contract.utils';
import { PAWG_TOKEN } from './constants';

async function main() {
  // await deployTestProtocolToken();
  // await deployTestXToken(PAWG_TOKEN);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
