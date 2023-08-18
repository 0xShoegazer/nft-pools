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
  created: boolean;
  addedToChef: boolean;
}

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

    // TODO: Set start time once presale and liquidity things are settled
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

    // TODO: Create the NFT pools and add to chef for current PCS farms/pools
    const pools: PoolInfo[] = [
      {
        pool: 'BBT-ETH',
        lpAddress: '0xf4b96d5162adee867b6361e9f1848d701c4286c7',
        allocationPoints: 1,
        allocationPointsWETH: 1,
        created: true,
        addedToChef: true,
      },
    ];

    //  await createPools(pools, signer);

    // TODO: updatePool on any pools created then before "go live"
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

async function createPools(pools: PoolInfo[], signer: SignerWithAddress) {
  pools = pools.filter((p) => !p.created);

  for (const pool of pools) {
    const nftPoolAddress = await createNFTPool(pool, signer);
    await sleepWait();
    await addPoolToChef(nftPoolAddress, pool, true, signer);
  }
}

async function createNFTPool(pool: PoolInfo, signer: SignerWithAddress) {
  if (pool.addedToChef) {
    console.log('Pool already added to chef');
    return;
  }
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
