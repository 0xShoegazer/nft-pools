import { ethers } from 'hardhat';
import {
  deployDividends,
  deployFactory,
  deployProtocolToken,
  deployXToken,
  deployYieldBooster,
  runProtcolSetup,
} from './utils/contract.utils';
import { parseUnits } from 'ethers/lib/utils';
import { getBlockTime } from '../test/utils';

const maxSupply = parseUnits('10000000');
const initialSupply = parseUnits('750000');
const emissionRate = parseUnits('0.05');
const treasury = '0x03d4C4b1B115c068Ef864De2e21E724a758892A2'; // @note dev account

// From 0.8.15 repo
export const MASTER_CHEF = '';

async function main() {
  const signer = (await ethers.getSigners())[0];

  // await deployProtocolToken('Deez Token', 'DEEZ', maxSupply, initialSupply, emissionRate, treasury, signer);
  // await deployXToken('0x74a52eb08d699CD8BE1d42dA4B241d526B8a8285', 'Escrowed Deez', 'xDEEZ', signer);

  // const blockTime = await getBlockTime(ethers.provider);
  // await deployDividends('0x8DFAf055e21B16302DBf00815e5b4d9b6042a4Df', blockTime + 100, signer);
  //
  // TODO: Set dividends on xtoken
  // const xtoken = await ethers.getContractAt('xToken', '0x8DFAf055e21B16302DBf00815e5b4d9b6042a4Df', signer);
  // await xtoken.updateDividendsAddress('0x7bb14ED986Dae0C8423350A7f1C59a31b3C84509');
  // console.log('xToken Dividends updated.');

  // Yield boost
  // await deployYieldBooster('0x8DFAf055e21B16302DBf00815e5b4d9b6042a4Df', signer);

  // const blockTime = await getBlockTime(ethers.provider);
  // const protocolTokenEmissionStart = blockTime + 60;
  // const protocolToken = await ethers.getContractAt('Noodleswap', NOOD_TOKEN, signer);
  // await protocolToken.initializeEmissionStart(protocolTokenEmissionStart);

  // TODO: MasterChef can only be set once on the token
  // await protocolToken.initializeMasterAddress(MASTER_CHEF);
  // console.log(await protocolToken.masterAddress());

  await deployFactory(
    '0xbF79915e80DE0A361A4F35175BA9bF2e91B10424',
    '0x74a52eb08d699CD8BE1d42dA4B241d526B8a8285',
    '0x8DFAf055e21B16302DBf00815e5b4d9b6042a4Df',
    signer
  );
  // await runProtcolSetup();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
