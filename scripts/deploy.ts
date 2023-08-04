import { ethers } from 'hardhat';
import {
  deployDividends,
  deployFactory,
  deployProtocolToken,
  deployXToken,
  deployYieldBooster,
  runProtcolSetup,
} from './utils/contract.utils';
import { DEV_ACCOUNT } from './constants';
import { parseUnits } from 'ethers/lib/utils';
import { getBlockTime } from '../test/utils';

const maxSupply = parseUnits('10000000');
const initialSupply = parseUnits('750000');
const emissionRate = parseUnits('0.05');
const treasury = DEV_ACCOUNT;

const NOOD_TESTNET = '0xd71114b3AD1Ec657B4194E0B3b7C9fC71C7bdbEF';
const XNOOD_TESTNET = '0x626355410729525eec3fd5628D840d683F24456d';
const YIELD_BOOSTER_TESTNET = '0xA124060495eeBb12ff2d6Ab36a7080a8cf1c9D98';
const DIVIDENDS_TESTNET = '0x6E9776a02fF00d2D0FC986B78B64fAD7414c3B00';
const NFTPOOL_FACTORY_TESTNET = '0x66118981E4B7015C8310eE8D10C830803d85d64F';
const MASTER_CHEF_TESTNET = '';

const NOOD_TOKEN = NOOD_TESTNET;
const XNOOD_TOKEN = XNOOD_TESTNET;
const YIELD_BOOSTER = YIELD_BOOSTER_TESTNET;
const NFTPOOL_FACTORY = NFTPOOL_FACTORY_TESTNET;
const DIVIDENDS = DIVIDENDS_TESTNET;
// From 0.8.15 repo
export const MASTER_CHEF = '0x5859c161A7ea5F8Ce4e8732749f49f4dF65105e4';

async function main() {
  const signer = (await ethers.getSigners())[0];

  // await deployProtocolToken('Noodleswap', maxSupply, initialSupply, emissionRate, treasury, signer);
  // await deployXToken(NOOD_TOKEN, 'xNOOD', signer);

  // const blockTime = await getBlockTime(ethers.provider);
  // const protocolTokenEmissionStart = blockTime + 60;
  // const protocolToken = await ethers.getContractAt('Noodleswap', NOOD_TOKEN, signer);
  // await protocolToken.initializeEmissionStart(protocolTokenEmissionStart);

  // TODO: MasterChef can only be set once on the token
  // await protocolToken.initializeMasterAddress(MASTER_CHEF);
  // console.log(await protocolToken.masterAddress());

  // const blockTime = await getBlockTime(ethers.provider);
  // await deployDividends(XNOOD_TOKEN, blockTime + 100, signer);
  // TODO: Set dividends on xtoken
  // const xtoken = await ethers.getContractAt('xNOOD', XNOOD_TOKEN, signer);
  // await xtoken.updateDividendsAddress(DIVIDENDS);
  // await deployYieldBooster(XNOOD_TOKEN, signer);

  await deployFactory(MASTER_CHEF, NOOD_TOKEN, XNOOD_TOKEN, signer);
  // await runProtcolSetup();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
