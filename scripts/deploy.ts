import { ethers } from 'hardhat';
import {
  deployFactory,
  deployTestProtocolToken,
  deployTestXToken,
  deployYieldBooster,
  runProtcolSetup,
} from './utils/contract.utils';
import {
  BASE_MASTER_CHEF,
  BASE_MASTER_CHEF_TESTNET,
  PAWG_TOKEN,
  PAWG_TOKEN_TESTNET,
  XPAWG_TOKEN,
  XPAWG_TOKEN_TESTNET,
} from './constants';

async function main() {
  // await deployTestProtocolToken();
  // await deployTestXToken(PAWG_TOKEN_TESTNET);
  // await deployYieldBooster(XPAWG_TOKEN_TESTNET);
  await deployFactory(BASE_MASTER_CHEF_TESTNET, PAWG_TOKEN_TESTNET, XPAWG_TOKEN_TESTNET);
  // await runProtcolSetup();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
