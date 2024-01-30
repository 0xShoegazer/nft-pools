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

const FACTORY_MAINNET = '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9';
const FACTORY_TESTNET = '0xA6Fae39901858a6dD51B5068C11348305a031cdF';
const CHEF_MAINNET = '0x327df1e6de05895d2ab08513aadd9313fe505d86';
const CHEF_TESTNET = '0x396F2cA2a470EfC92511fD3e99833d28D38CFf53';
const TREASURY = '0x03d4C4b1B115c068Ef864De2e21E724a758892A2'; // @note Dev acount
const PROTOCOL_TOKEN_MAINNET = '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB';
const PROTOCOL_TOKEN_TESTNET = '0xB687282AD4Fb8897D5Cd41f3C1A54DeB4cc88625';
const XTOKEN_MAINNET = '0xFb68BBfaEF679C1E653b5cE271a0A383c0df6B45';
const XTOKEN_TESTNET = '0x2ee99Be3c520B7Bd64f51641c3e7Ef28950E03B7';
const YIELD_BOOSTER_MAINNET = '0x0fE9E7B39dbdfe32c9F37FAcCec6b33d290CbF50';
const YIELD_BOOSTER_TESTNET = '0x4Ab974442D6e67c32E40f44BcDC22388F3F16d9e';

const SFS_MAINNET = '0x8680CEaBcb9b56913c519c069Add6Bc3494B7020';
const SFS_TESTNET = '0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6';

interface PoolInfo {
  pool: string;
  lpAddress: string;
  allocationPoints: number;
  allocationPointsWETH: number;
}

async function main() {
  try {
    const signer = (await ethers.getSigners())[0];

    const maxSupply = parseUnits('10000000');
    const initialMint = parseUnits('600000');
    const initialEmissionRate = parseUnits('0');
    //await deployProtocolToken(maxSupply, initialMint, initialEmissionRate, TREASURY, SFS_TESTNET, signer);
    console.log(`${maxSupply.toString()} ${initialMint.toString()} ${initialEmissionRate.toString()} ${TREASURY}`);

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

// async function createNFTPool(pool: PoolInfo, signer: SignerWithAddress) {
//   console.log(`Creating NFTPool for pool: ${pool.pool}`);

//   const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
//   const tx = await factory.createPool(pool.lpAddress);
//   const rx = await tx.wait();

//   const nftPoolAddress = ethers.utils.defaultAbiCoder.decode(['address'], rx.events[1].data);
//   console.log('NFTPool created: ' + nftPoolAddress[0]);

//   return nftPoolAddress[0];
// }

// async function addPoolToChef(nftPoolAddress: string, pool: PoolInfo, withUpdate: boolean, signer: SignerWithAddress) {
//   console.log(`Adding NFTPool to chef for pool: ${pool.pool}`);

//   const chef = await ethers.getContractAt(RAMSEY_ABI, CHEF, signer);
//   await chef.add(nftPoolAddress, pool.allocationPoints, pool.allocationPointsWETH, withUpdate);
// }

main();
