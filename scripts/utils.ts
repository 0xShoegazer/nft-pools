import { ethers, upgrades } from 'hardhat';
import { ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from './constants';
import { BigNumber, Contract } from 'ethers';
import { MAX_UINT256 } from '../test/constants';
import { formatEther } from 'ethers/lib/utils';
import { ERC20_ABI } from '../test/abis/erc20-abi';

export async function deployRamsey(yieldBoooster: string, signer) {
  const factory = await ethers.getContractFactory('ChefRamsey', signer);
  const instance = await upgrades.deployProxy(factory, [
    xARX_ADDRESS,
    ARBIDEX_CHEF_ADDRESS,
    ARBIDEX_TREASURY,
    yieldBoooster,
  ]);
  await instance.deployed();
  console.log(`ChefRamsey deployed at: ${instance.address}`);

  return instance;
}

export async function deployRewardManager() {
  const factory = await ethers.getContractFactory('NFTPoolRewardManager');
  const instance = await factory.deploy(ARBIDEX_TREASURY);
  await instance.deployed();
  console.log(`NFTPoolRewardManager deployed at: ${instance.address}`);

  return instance;
}

export async function deployPoolFactory(master: string, mainToken: string, xToken: string) {
  const factory = await ethers.getContractFactory('NFTPoolFactory');
  const instance = await factory.deploy(master, mainToken, xToken);
  await instance.deployed();
  console.log(`NFTPoolFactory deployed at: ${instance.address}`);

  return instance;
}

export async function createPool(factoryAddress: string, lpToken: string, rewardManager: string): Promise<string> {
  const factory = await ethers.getContractAt('NFTPoolFactory', factoryAddress);
  const tx = await factory.createPool(lpToken, rewardManager);
  const receipt = await tx.wait();

  const poolEvent = receipt.events.find((evt) => evt.event === 'PoolCreated');
  const poolAddress = poolEvent.args.pool;
  console.log('New pool address: ' + poolAddress);

  return poolAddress;
}

export async function addPoolToChef(nftPoolAddress: string, allocationPoints: number) {
  const chef = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS);
  await chef.add(nftPoolAddress, allocationPoints, true);
  console.log(`New pool added to chef`);
}

export async function deployYieldBooster(xToken: string) {
  const factory = await ethers.getContractFactory('YieldBooster');
  const instance = await factory.deploy(xToken);
  await instance.deployed();
  console.log(`YieldBooster at: ${instance.address}`);

  return instance;
}

export async function addRewardToken(rewardManager: string, token: string, sharesPerSecond: BigNumber) {
  const manager = await ethers.getContractAt('NFTPoolRewardManager', rewardManager);
  await manager.addRewardToken(token, sharesPerSecond);
}

export async function createPosition(
  poolAddress: string,
  lpPoolAddress: string,
  amount: BigNumber,
  signer,
  lockDuration = 0
) {
  const pool = await ethers.getContractAt('NFTPool', poolAddress);
  await approveTokens([lpPoolAddress], poolAddress, signer);
  const tx = await pool.createPosition(amount, lockDuration);
  const receipt = await tx.wait();

  const evt = receipt.events.find((evt) => evt.event === 'CreatePosition');
  const tokenId = evt.args.tokenId;
  console.log('New token ID: ' + tokenId);

  return tokenId;
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
