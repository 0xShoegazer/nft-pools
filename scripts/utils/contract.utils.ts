import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

export async function deployProtocolToken(
  name: string,
  symbol: string,
  maxSupply: BigNumber,
  initialSupply: BigNumber,
  emissionRate: BigNumber,
  treasury: string,
  signer: SignerWithAddress
) {
  // Stock/defualt Cam settings for testing setup
  // const maxSupply = parseUnits('10000000');
  // const initialSupply = parseUnits('25000');
  // const emissionRate = parseUnits('0.01');
  // const treasury = DEV_ACCOUNT;

  console.log('Args:');
  console.log(
    `${name} ${symbol} ${maxSupply.toString()} ${initialSupply.toString()} ${emissionRate.toString()} ${treasury}`
  );

  const factory = await ethers.getContractFactory('ProtocolToken', signer);
  const instance = await factory.deploy(name, symbol, maxSupply, initialSupply, emissionRate, treasury);
  await instance.deployed();

  console.log(`${name} deployed to: ${instance.address}`);
}

export async function deployXToken(mainToken: string, name: string, symbol: string, signer: SignerWithAddress) {
  console.log('Args:');
  console.log(`${mainToken} ${name} ${symbol}`);

  const factory = await ethers.getContractFactory('xToken', signer);
  const instance = await factory.deploy(mainToken, name, symbol);
  await instance.deployed();

  console.log(`xToken deployed to: ${instance.address}`);
}

export async function deployFactory(chef: string, protoToko: string, xToken: string, signer: SignerWithAddress) {
  const NFTPoolFactory = await ethers.getContractFactory('NFTPoolFactory', signer);
  const instance = await NFTPoolFactory.deploy(chef, protoToko, xToken);
  await instance.deployed();

  console.log(`NFTPoolFactory deployed to: ${instance.address}`);
}

export async function deployYieldBooster(xToken: string, signer: SignerWithAddress) {
  const factory = await ethers.getContractFactory('YieldBooster', signer);
  const instance = await factory.deploy(xToken);
  await instance.deployed();

  console.log(`YieldBooster deployed to: ${instance.address}`);
}

export async function deployDividends(xToken: string, startTime: number, signer: SignerWithAddress) {
  const factory = await ethers.getContractFactory('Dividends', signer);
  const instance = await factory.deploy(xToken, startTime);
  await instance.deployed();

  console.log(`Dividends deployed to: ${instance.address}`);
  console.log(`Args: ${xToken} ${startTime}`);
}

export async function runProtcolSetup(chef: string, protocolToken: string) {
  // main token
  // - deployTestProtocolToken
  // XToken
  // - deployTestXToken
  //
  // set chef on token
  //
  /**
   *  main token
   * - deployTestProtocolToken
   *
   * XToken
   * - deployTestXToken
   *
   * - Set chef on main token
   * - Start emissions
   *
   */

  const mainToken = await ethers.getContractAt('Noodleswap', protocolToken);
  await mainToken.initializeMasterAddress(chef);
  console.log('MasterChef successfully set on protocol token.');
}
