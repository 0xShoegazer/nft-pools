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

const FACTORY = '';
const CHEF = '';
const TREASURY = '';
const PROTOCOL_TOKEN = '';
const XTOKEN = '';

interface PoolInfo {
  pool: string;
  lpAddress: string;
  allocationPoints: number;
  allocationPointsWETH: number;
}

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
    // const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
    // console.log(await factory.getPool('0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A'));

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
    // const blockTime = await getCurrentBlockTime(ethers.provider);
    // // base is around 2 seconds right now
    // // 60 sec * 22 minutes
    // const start = blockTime + 60 * 21;
    // console.log(start);

    console.log(new Date(1692558049 * 1000).toLocaleString());
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
