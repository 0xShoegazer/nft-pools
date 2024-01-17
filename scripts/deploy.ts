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

const FACTORY = '0x0D8769D15D550780AcF016f6fB1586e561F8C871';
const CHEF = '0x1af81D2aB7e75433Bc50Cd06CD5Ec33d94D25d3F';
const TREASURY = '0x03d4C4b1B115c068Ef864De2e21E724a758892A2'; // Dev acount
const PROTOCOL_TOKEN = '0xD1ffA3ceB16110c27eAe3284675348a8Cb314F58';
const XTOKEN = '0x9195Cd056f7B6A09e77aD66C9BbBDf2873D64ad9';
const YIELD_BOOSTER = '0xEb6a909e8c5eAdaFDDd7581f18a7Ed07cb4bE538';

interface PoolInfo {
  pool: string;
  lpAddress: string;
  allocationPoints: number;
  allocationPointsWETH: number;
}

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];

    // const maxSupply = parseUnits('10000000');
    // const initialMint = parseUnits('840000');
    // const initialEmissionRate = parseUnits('0.15');
    // await deployProtocolToken(maxSupply, initialMint, initialEmissionRate, TREASURY, signer);
    // console.log(`${maxSupply.toString()} ${initialMint.toString()} ${initialEmissionRate.toString()} ${TREASURY}`);

    // // TODO: transfer ownerships as needed after setup
    // const bsx = await ethers.getContractAt('BaseXToken', PROTOCOL_TOKEN, signer);
    // await bsx.initializeMasterAddress(CHEF);

    // TODO: INIT START TIME: Set start time and emissions once presale and liquidity things are settled
    // const blockTime = await getCurrentBlockTime(ethers.provider);
    // const start = blockTime + 120;
    // await bsx.initializeEmissionStart(start);
    // await bsx.updateEmissionRate(parseUnits('0'));

    // await deployXToken(PROTOCOL_TOKEN, signer);
    // await deployYieldBooster(XTOKEN);

    // Can set dividends on xtoken if needed
    // const blockTime = await getCurrentBlockTime(ethers.provider)
    // const dividendsStart = blockTime + 99999999999999999999999999
    // await deployDividends(XTOKEN, dividendsStart, signer);

    // await deployPoolFactory(CHEF, PROTOCOL_TOKEN, XTOKEN, signer);

    // const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
    // console.log(await factory.getPool('0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A'));

    // const pool = {
    //   pool: 'GLP',
    //   lpAddress: '0x688487605ebD93332756a69059324C12c1Ef5e3C',
    //   allocationPoints: 50,
    //   allocationPointsWETH: 50,
    // };
    // const nftPoolAddress = await createNFTPool(pool, signer);
    // await sleepWait();
    // await addPoolToChef(nftPoolAddress, pool, false, signer);

    // TODO: updatePool() on any pools created then before "go live"
    // const blockTime = await getCurrentBlockTime(ethers.provider);
    // // base is around 2 seconds right now
    // // 60 sec * 22 minutes
    // const start = blockTime + 60 * 21;
    // console.log(start);
    // console.log(new Date(1692558049 * 1000).toLocaleString());
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

  return nftPoolAddress[0];
}

async function addPoolToChef(nftPoolAddress: string, pool: PoolInfo, withUpdate: boolean, signer: SignerWithAddress) {
  console.log(`Adding NFTPool to chef for pool: ${pool.pool}`);

  const chef = await ethers.getContractAt(RAMSEY_ABI, CHEF, signer);
  await chef.add(nftPoolAddress, pool.allocationPoints, pool.allocationPointsWETH, withUpdate);
}

main();
