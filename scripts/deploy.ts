import { ethers } from 'hardhat';
import {
  deployFactory,
  deployTestProtocolToken,
  deployTestXToken,
  deployYieldBooster,
  runProtcolSetup,
} from './utils/contract.utils';
import { BASE_MASTER_CHEF, PAWG_TOKEN, XPAWG_TOKEN } from './constants';

async function main() {
  // await deployTestProtocolToken();
  // await deployTestXToken(PAWG_TOKEN);
  // await deployYieldBooster(XPAWG_TOKEN);
  // await deployFactory(BASE_MASTER_CHEF, PAWG_TOKEN, XPAWG_TOKEN);
  // await runProtcolSetup();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
