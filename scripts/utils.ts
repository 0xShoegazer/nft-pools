import { ethers } from 'hardhat';
import { BigNumber, Contract } from 'ethers';
import { MAX_UINT256 } from '../test/constants';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { ERC20_ABI } from '../test/abis/erc20-abi';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export async function deployProtocolToken(
  maxSupply: BigNumber,
  initialMint: BigNumber,
  initialEmissionRate: BigNumber,
  treasury: string,
  feeShare: string,
  signer: SignerWithAddress
) {
  const factory = await ethers.getContractFactory('SwapModeToken', signer);
  const instance = await factory.deploy(maxSupply, initialMint, initialEmissionRate, treasury, feeShare, {
    // gasPrice: parseUnits('0'),
    // gasLimit: 500000,
  });
  await instance.deployed();
  console.log(`SwapModeToken deployed at: ${instance.address}`);

  return instance;
}

export async function deployXToken(mainToken: string, signer: SignerWithAddress) {
  const factory = await ethers.getContractFactory('xSwapMode', signer);
  const instance = await factory.deploy(mainToken);
  await instance.deployed();
  console.log(`xSwapMode deployed at: ${instance.address}`);

  return instance;
}

export async function deployPoolFactory(master: string, mainToken: string, xToken: string, signer) {
  const factory = await ethers.getContractFactory('NFTPoolFactory', signer);
  const instance = await factory.deploy(master, mainToken, xToken);
  await instance.deployed();
  console.log(`NFTPoolFactory deployed at: ${instance.address}`);

  return instance;
}

export async function deployDividends(xToken: string, startTime: number, signer) {
  const factory = await ethers.getContractFactory('Dividends', signer);
  const instance = await factory.deploy(xToken, startTime);
  await instance.deployed();
  console.log(`Dividends deployed at: ${instance.address}`);

  return instance;
}

// export async function createPool(factoryAddress: string, lpToken: string, signer): Promise<string> {
//   const factory = await ethers.getContractAt('NFTPoolFactory', factoryAddress, signer);
//   const tx = await factory.createPool(lpToken);
//   const receipt = await tx.wait();

//   const poolEvent = receipt.events.find((evt) => evt.event === 'PoolCreated');
//   const poolAddress = poolEvent.args.pool;
//   console.log('New pool address: ' + poolAddress);

//   return poolAddress;
// }

// /**
//  * Util that creates a pool and then approves the new instance for lp token
//  * @param factoryAddress
//  * @param lpToken
//  * @param rewardManager
//  * @param signer
//  * @returns
//  */
// export async function createPoolWithInstance(
//   factoryAddress: string,
//   lpToken: string,
//   signer
// ): Promise<{
//   lpInstance: Contract;
//   nftPool: Contract;
// }> {
//   const nftPoolAddress = await createPool(factoryAddress, lpToken, signer);

//   const lpInstance = await getERC20WithSigner(lpToken, signer);
//   await lpInstance.approve(nftPoolAddress, MAX_UINT256);

//   return {
//     lpInstance,
//     nftPool: getNFTPool(nftPoolAddress, signer),
//   };
// }

export async function addPoolToChef(ramsey: string, nftPoolAddress: string, allocationPoints: number, signer) {
  // const chef = await ethers.getContractAt('ChefRamsey', ramsey, signer);
  // await chef.add(nftPoolAddress, allocationPoints, true);
  // console.log(`New pool added to chef`);
}

export async function deployYieldBooster(xToken: string) {
  const factory = await ethers.getContractFactory('YieldBooster');
  const instance = await factory.deploy(xToken);
  await instance.deployed();
  console.log(`YieldBooster at: ${instance.address}`);

  return instance;
}

export async function addRewardToken(rewardManager: string, token: string, sharesPerSecond: BigNumber, signer) {
  console.log('addRewardToken: Adding reward token');
  const manager = await ethers.getContractAt('PoolRewardManager', rewardManager, signer);
  await manager.addRewardToken(token, sharesPerSecond);
  console.log('Reward token added');
}

export async function updateRewardToken(rewardManager: string, token: string, sharesPerSecond: BigNumber, signer) {
  const manager = await ethers.getContractAt('PoolRewardManager', rewardManager, signer);
  await manager.updateRewardToken(token, sharesPerSecond);
}

export async function createPosition(
  poolAddress: string,
  lpPoolAddress: string,
  amount: BigNumber,
  signer,
  lockDuration = 0
) {
  const pool = await ethers.getContractAt('NFTPool', poolAddress, signer);
  await approveTokens([lpPoolAddress], poolAddress, signer);
  const tx = await pool.createPosition(amount, lockDuration);
  const receipt = await tx.wait();

  const evt = receipt.events.find((evt) => evt.event === 'CreatePosition');
  const tokenId = evt.args.tokenId;
  console.log('New token ID: ' + tokenId);

  return tokenId.toNumber();
}

export async function approveTokens(tokens: string[], spender: string, signer) {
  for (const token of tokens) {
    const tc = await getERC20(token, signer);
    await tc.approve(spender, MAX_UINT256);
  }
}

export async function getSignerAccount() {
  return (await ethers.getSigners())[0];
}

export async function getTokenBalance(token: string, who: string, signer) {
  const tc = getERC20(token, signer);
  const balance = await tc.balanceOf(who);
  // console.log('Token balance: ' + formatEther(balance));

  return balance;
}

export function getERC20(address: string, signer) {
  return new Contract(address, ERC20_ABI, signer);
}

export function getERC20WithSigner(address: string, signer) {
  return new Contract(address, ERC20_ABI, signer);
}

export async function getTokenAllowance(token: string, spender: string) {
  const signer = await getSignerAccount();
  const tc = await getERC20(token, signer);
  console.log(`Allowance for ${token}: ${formatEther(await tc.allowance(signer.address, spender))}`);
}

export async function sleepWait(ms = 1000) {
  console.log(`Sleeping for ${ms / 1000} seconds...`);
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}
