import { ethers } from 'hardhat';

import { parseUnits } from 'ethers/lib/utils';
import { giveTokenBalanceFor } from '../utils';
import { MAX_UINT256, UNIV2_POOL_BALANCEOF_SLOT } from '../constants';
import { impersonateAccount, setBalance } from '@nomicfoundation/hardhat-network-helpers';
import { RAMSEY_ABI } from '../abis/chef-ramsey-abi';
import { getERC20WithSigner } from '../../scripts/utils';
import { OLD_CHEF_ABI } from '../abis/old-chef-abi';
import { latest } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';

const DEV_ACCOUNT = '0xA87FbE1B95e58aD2505ff7a7827c78cfb99375B0';
const FACTORY = '0xef24b5f1B763D33e1723a57Ee4d5a2a5faa5c11B';
const ETH_BSWAP_LP = '0xE80B4F755417FB4baF4dbd23C029db3F62786523';
const CHEF = '0xaBEb4DeD0b07460F9C9edb85864DFd3a6865D570';
const BSX = '0xd5046B976188EB40f6DE40fB527F89c05b323385';
const xBSX = '0xE4750593d1fC8E74b31549212899A72162f315Fa';
const OLD_CHEF = '0x2B0A43DCcBD7d42c18F6A83F86D1a19fA58d541A';
const BSWAP = '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9';

export async function testFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);
  await setBalance(DEV_ACCOUNT, parseUnits('10000'));

  const lpPoolAddress = ETH_BSWAP_LP;
  const userOneLpBalance = parseUnits('100');
  // Setup account funds
  await giveTokenBalanceFor(
    ethers.provider,
    lpPoolAddress,
    signer.address,
    UNIV2_POOL_BALANCEOF_SLOT,
    userOneLpBalance
  );

  const factory = await ethers.getContractAt('NFTPoolFactory', FACTORY, signer);
  const tx = await factory.createPool(lpPoolAddress);
  const rx = await tx.wait();
  const evt = rx.events.find((e) => e.event === 'PoolCreated');

  const nftPoolAddress = evt.args.pool;
  const nftPool = await ethers.getContractAt('NFTPool', nftPoolAddress, signer);

  const masterChef = await ethers.getContractAt(RAMSEY_ABI, CHEF, signer);
  await masterChef.add(nftPoolAddress, 100, 100, false);

  const lpInstance = await getERC20WithSigner(lpPoolAddress, signer);
  await lpInstance.approve(nftPool.address, MAX_UINT256);
  await nftPool.createPosition(userOneLpBalance.div(2), 0);

  const [BaseXToken, xBSXToken, oldChef] = await Promise.all([
    ethers.getContractAt('BaseXToken', BSX, signer),
    ethers.getContractAt('xBSX', xBSX, signer),
    ethers.getContractAt(OLD_CHEF_ABI, OLD_CHEF, signer),
  ]);

  await BaseXToken.initializeMasterAddress(masterChef.address);

  const start = await latest();
  await BaseXToken.initializeEmissionStart(start + 10);
  await BaseXToken.updateEmissionRate(parseUnits('0.01'));

  return {
    signer,
    nftPool,
    masterChef,
    tokenId: 1,
    BaseXToken,
    xBSXToken,
    oldChef,
    oldChefPid: 16,
    bswapToken: getERC20WithSigner(BSWAP, signer),
  };
}
