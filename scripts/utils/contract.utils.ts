import { ethers } from 'hardhat';
import { DEV_ACCOUNT } from '../constants';
import { parseUnits } from 'ethers/lib/utils';

export async function deployTestProtocolToken() {
  // Stock/defualt Cam settings for testing setup
  const maxSupply = parseUnits('200000');
  const initialSupply = parseUnits('25000');
  const emissionRate = parseUnits('0.01');
  const treasury = DEV_ACCOUNT;

  console.log('Args:');
  console.log(`${maxSupply.toString()} ${initialSupply.toString()} ${emissionRate.toString()} ${treasury}`);

  const factory = await ethers.getContractFactory('PAWGToken');
  const instance = await factory.deploy(maxSupply, initialSupply, emissionRate, treasury);
  await instance.deployed();

  console.log(`PAWGToken deployed to: ${instance.address}`);
}

export async function deployTestXToken(mainToken: string) {
  console.log('Args:');
  console.log(`${mainToken}`);

  const factory = await ethers.getContractFactory('xPAWG');
  const instance = await factory.deploy(mainToken);
  await instance.deployed();

  console.log(`xPAWG deployed to: ${instance.address}`);
}

export async function deployFactory() {
  //
}

export async function runProtcolSetup() {
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
}
