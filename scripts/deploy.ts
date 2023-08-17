import { ethers } from 'hardhat';
import { deployPoolFactory, deployProtocolToken, deployXToken } from './utils';
import { parseUnits } from 'ethers/lib/utils';

const FACTORY = '0xef24b5f1B763D33e1723a57Ee4d5a2a5faa5c11B';

const CHEF = '0xaBEb4DeD0b07460F9C9edb85864DFd3a6865D570';
const TREASURY = '0xAF1823bACd8EDDA3b815180a61F8741fA4aBc6Dd';

const PROTOCOL_TOKEN = '0xd5046B976188EB40f6DE40fB527F89c05b323385';
const XTOKEN = '0xE4750593d1fC8E74b31549212899A72162f315Fa';

// @note this is using arbidex dev account instead of baseswap deployer

// TODO: transfer ownerships as needed after setup

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];

    // const maxSupply = parseUnits('10000000');
    // const initialMint = parseUnits('840000');
    // const initialEmissionRate = parseUnits('0');
    // await deployProtocolToken(maxSupply, initialMint, initialEmissionRate, TREASURY, signer);
    // console.log(`${maxSupply.toString()} ${initialMint.toString()} ${initialEmissionRate.toString()} ${TREASURY}`);

    // TODO: Set chef on token
    // initializeMasterAddress
    // initializeEmissionStart
    // TODO: transfer ownerships as needed after setup

    // await deployXToken(PROTOCOL_TOKEN, signer); // verify
    // Can set dividends on xtoken if needed

    // const factory = await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);

    // TODO: Test setting chef on the token so we dont have to redeploy the actual token
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
