import { ethers, upgrades } from 'hardhat';
import { ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from './constants';
import { BigNumber, Contract } from 'ethers';
import { OLD_CHEF_ABI } from '../test/abis/arbidex-chef-abi';
import { MAX_UINT256, ZERO_ADDRESS } from '../test/constants';
import { formatEther } from 'ethers/lib/utils';
import { ERC20_ABI } from '../test/abis/erc20-abi';

export async function deployRamsey() {
  const factory = await ethers.getContractFactory('ChefRamsey');
  const instance = await upgrades.deployProxy(factory, [
    xARX_ADDRESS,
    ARBIDEX_CHEF_ADDRESS,
    ARBIDEX_TREASURY,
    ZERO_ADDRESS,
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

  // return deployContract('NFTPoolFactory', [master, mainToken, xToken]);

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

export async function createPosition(poolAddress: string, lpPoolAddress: string, amount: BigNumber, lockDuration = 0) {
  const pool = await ethers.getContractAt('NFTPool', poolAddress);
  await approveTokens([lpPoolAddress], poolAddress);
  return await pool.createPosition(amount, lockDuration);
}

export async function approveTokens(tokens: string[], spender: string) {
  for (const token of tokens) {
    const tc = await getERC20(token);
    await tc.approve(spender, MAX_UINT256);
  }
}

export async function getSignerAccount() {
  return (await ethers.getSigners())[0];
}

export async function getTokenBalance(token: string, who: string) {
  const tc = await getERC20(token);
  const balance = await tc.balanceOf(who);
  console.log('Token balance: ' + formatEther(balance));

  return balance;
}

export async function getERC20(address: string) {
  return new Contract(address, ERC20_ABI, await getSignerAccount());
}

export async function getERC20WithSigner(address: string, signer) {
  return new Contract(address, ERC20_ABI, signer);
}

export async function getTokenAllowance(token: string, spender: string) {
  const signer = await getSignerAccount();
  const tc = await getERC20(token);
  console.log(`Allowance for ${token}: ${formatEther(await tc.allowance(signer.address, spender))}`);
}
