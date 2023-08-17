import { ethers } from 'hardhat';
import { deployPoolFactory, deployProtocolToken, deployXToken, deployYieldBooster } from './utils';
import { parseUnits } from 'ethers/lib/utils';
import { getCurrentBlockTime } from '../test/utils';

const FACTORY = '0x1d23317069d9a01b99A2B755A4Bb7528450198B8';

// const CHEF_UPGRADEABLE = '0xaBEb4DeD0b07460F9C9edb85864DFd3a6865D570';
const CHEF = '0x6Fc0f134a1F20976377b259687b1C15a5d422B47';
const TREASURY = '0xAF1823bACd8EDDA3b815180a61F8741fA4aBc6Dd';

const PROTOCOL_TOKEN = '0xd5046B976188EB40f6DE40fB527F89c05b323385';
const XTOKEN = '0xE4750593d1fC8E74b31549212899A72162f315Fa';

// @note this is using arbidex dev account instead of baseswap deployer

// TODO: transfer ownerships as needed after setup

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];

    // await deployYieldBooster(XTOKEN);

    // const maxSupply = parseUnits('10000000');
    // const initialMint = parseUnits('840000');
    // const initialEmissionRate = parseUnits('0');
    // await deployProtocolToken(maxSupply, initialMint, initialEmissionRate, TREASURY, signer);
    // console.log(`${maxSupply.toString()} ${initialMint.toString()} ${initialEmissionRate.toString()} ${TREASURY}`);

    // TODO: Set chef on token
    // initializeMasterAddress
    // initializeEmissionStart
    // TODO: transfer ownerships as needed after setup
    // const bsx = await ethers.getContractAt('BaseXToken', PROTOCOL_TOKEN, signer);
    // await bsx.initializeMasterAddress(CHEF);

    // TODO: Set start time once presale and liquidity things are settled
    const emissionRate = parseUnits('0.15');
    // const blockTime = await getCurrentBlockTime(ethers.provider)
    // const start = blockTime + 120
    // await bsx.initializeEmissionStart(start);
    // await bsx.updateEmissionRate(parseUnits('0'));

    // await deployXToken(PROTOCOL_TOKEN, signer); // verify
    // Can set dividends on xtoken if needed

    // TODO: Deploy new factory with new chef
    // await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);

    const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
