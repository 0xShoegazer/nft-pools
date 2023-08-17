import { ethers } from 'hardhat';
import { deployPoolFactory, deployProtocolToken } from './utils';
import { parseUnits } from 'ethers/lib/utils';

const CHEF = '';
const FACTORY = '';
const TREASURY = '0xAF1823bACd8EDDA3b815180a61F8741fA4aBc6Dd';

const PROTOCOL_TOKEN = '';
const XTOKEN = '';

// @note this is using arbidex dev account instead of baseswap deployer

// TODO: transfer ownerships as needed after setup

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];

    const maxSupply = parseUnits('10000000');
    const initialMint = parseUnits('840000');
    const initialEmissionRate = parseUnits('0');

    await deployProtocolToken(maxSupply, initialMint, initialEmissionRate, TREASURY, signer);

    // TODO: Set chef on token
    // initializeMasterAddress
    // initializeEmissionStart
    // TODO: transfer ownerships as needed after setup

    // const factory = await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
