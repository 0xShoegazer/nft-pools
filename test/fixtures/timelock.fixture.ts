import { impersonateAccount, setBalance } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, DEV_ACCOUNT, xARX_ADDRESS } from '../../scripts/constants';
import { deployRamsey, deployYieldBooster } from '../../scripts/utils';

export async function timelockFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);
  await setBalance(DEV_ACCOUNT, parseUnits('10000'));

  const yieldBoooster = await deployYieldBooster(xARX_ADDRESS);
  const ramsey = await deployRamsey(ARBIDEX_CHEF_ADDRESS, ARBIDEX_TREASURY, yieldBoooster.address, signer);

  // deploy timelock

  return {
    ramsey,
  };
}
