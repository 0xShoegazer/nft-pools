import { ethers } from 'hardhat';
import { ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from './constants';
import { Contract } from 'ethers';
import { CHEF_ABI } from '../test/abis/arbidex-chef-abi';

export async function deployContract(name: string, ...args) {
  const factory = await ethers.getContractFactory(name);
  const instance = await factory.deploy(...args);
  await instance.deployed();
  console.log(`${name} deployed at: ${instance.address}`);

  return instance;
}

export async function deployPoolFactory(master: string, mainToken: string, xToken: string) {
  const factory = await ethers.getContractFactory('NFTPoolFactory');
  const instance = await factory.deploy(master, mainToken, xToken);
  await instance.deployed();
  console.log(`NFTPoolFactory deployed at: ${instance.address}`);

  // return deployContract('NFTPoolFactory', [master, mainToken, xToken]);

  return instance;
}

export async function createPool(factoryAddress: string, lpToken: string): Promise<string> {
  const factory = await ethers.getContractAt('NFTPoolFactory', factoryAddress);
  const tx = await factory.createPool(lpToken);
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
