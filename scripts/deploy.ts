import { ethers } from 'hardhat';
import {
  deployDividends,
  deployPoolFactory,
  deployProtocolToken,
  deployXToken,
  deployYieldBooster,
  sleepWait,
} from './utils';
import { parseUnits } from 'ethers/lib/utils';
import { getCurrentBlockTime } from '../test/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { RAMSEY_ABI } from '../test/abis/chef-ramsey-abi';

const FACTORY = '0x1d23317069d9a01b99A2B755A4Bb7528450198B8';
// const CHEF_UPGRADEABLE = '0xaBEb4DeD0b07460F9C9edb85864DFd3a6865D570';
const CHEF = '0x6Fc0f134a1F20976377b259687b1C15a5d422B47';
const TREASURY = '0xAF1823bACd8EDDA3b815180a61F8741fA4aBc6Dd';
const PROTOCOL_TOKEN = '0xd5046B976188EB40f6DE40fB527F89c05b323385';
const XTOKEN = '0xE4750593d1fC8E74b31549212899A72162f315Fa';

interface PoolInfo {
  pool: string;
  lpAddress: string;
  allocationPoints: number;
  allocationPointsWETH: number;
}

// 1 - 0xE80B4F755417FB4baF4dbd23C029db3F62786523 - 2045
// 2 - 0x81a03d61c913BdcC60519423C8841C18FfB752a8 - 5
// 3 - 0x9A0b05F3cF748A114A4f8351802b3BFfE07100D4 - 200
// 5 - 0x6D3c5a4a7aC4B1428368310E4EC3bB1350d01455 - 205
// 6 - 0x07CFA5Df24fB17486AF0CBf6C910F24253a674D3 - 1300
// 7 - 0x41d160033C222E6f3722EC97379867324567d883 - 230
// 8 - 0xa2b120Cab75AEfDfAFdA6A14713349A3096EED79 - 30
// 9 - 0x2135780D04C96E14bC205d2c8B8eD4e716d09A2b - 25
// 10 - 0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A - 50
// 11 - 0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306 - 50
// 12 - 0x6EDa0a4e05fF50594E53dBf179793CADD03689e5 - 50
// 13 - 0x1cd6Ca847016A3bd0cC1fe2dF5027E78ea428170 - 50
// 14 - 0x317d373E590795e2c09D73FaD7498FC98c0A692B - 25
// 15 - 0x30dcc8444F8361D5CE119fC25e16AF0B583e88Fd - 50
// 16 - 0x29399d824a99789f587a491C59210326e8ef4545 - 1

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

    // TODO: transfer ownerships as needed after setup
    // const bsx = await ethers.getContractAt('BaseXToken', PROTOCOL_TOKEN, signer);
    // await bsx.initializeMasterAddress(CHEF);

    // TODO: INIT START TIME: Set start time once presale and liquidity things are settled
    const emissionRate = parseUnits('0.15');
    // const blockTime = await getCurrentBlockTime(ethers.provider)
    // const start = blockTime + 120
    // await bsx.initializeEmissionStart(start);
    // await bsx.updateEmissionRate(parseUnits('0'));

    // await deployXToken(PROTOCOL_TOKEN, signer); // verify
    // Can set dividends on xtoken if needed
    // const blockTime = await getCurrentBlockTime(ethers.provider)
    // const dividendsStart = blockTime + 99999999999999999999999999
    // await deployDividends(XTOKEN, dividendsStart, signer);

    // await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);

    // const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
    const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
    console.log(await factory.getPool('0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A'));

    // await createNFTPool(
    //   {
    //     pool: 'USD+-USDC',
    //     lpAddress: '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A',
    //     allocationPoints: 50,
    //     allocationPointsWETH: 50,
    //   },
    //   signer
    // );

    // TODO: updatePool on any pools created then before "go live"
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

async function createNFTPool(pool: PoolInfo, signer: SignerWithAddress) {
  console.log(`Creating NFTPool for pool: ${pool.pool}`);

  const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
  const tx = await factory.createPool(pool.lpAddress);
  const rx = await tx.wait();

  const nftPoolAddress = ethers.utils.defaultAbiCoder.decode(['address'], rx.events[1].data);
  console.log('NFTPool created: ' + nftPoolAddress[0]);

  nftPoolAddress[0];

  await sleepWait();

  await addPoolToChef(nftPoolAddress[0], pool, false, signer);
}

async function addPoolToChef(nftPoolAddress: string, pool: PoolInfo, withUpdate: boolean, signer: SignerWithAddress) {
  console.log(`Adding NFTPool to chef for pool: ${pool.pool}`);

  const chef = await ethers.getContractAt(RAMSEY_ABI, CHEF, signer);
  await chef.add(nftPoolAddress, pool.allocationPoints, pool.allocationPointsWETH, withUpdate);
}

main();
