import { ethers } from 'hardhat';
import { createPool, deployPoolFactory } from './utils';

const CHEF = '';
const FACTORY = '';
const TREASURY = '';

const PROTOCOL_TOKEN = '';
const XTOKEN = '';

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];
    const factory = await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
