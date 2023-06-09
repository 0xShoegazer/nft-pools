import { ethers } from 'hardhat';
import { deployRamsey, getERC20WithSigner } from '../../scripts/utils';
import { CHEF_RAMSEY_ADDRESS, DEV_ACCOUNT, DUMMY_TOKEN_ADDRESS } from '../../scripts/constants';
import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers';

export async function freshFixture() {
  await impersonateAccount(DEV_ACCOUNT);
  const signer = await ethers.getSigner(DEV_ACCOUNT);

  const oldRamsey = await ethers.getContractAt('ChefRamsey', CHEF_RAMSEY_ADDRESS, signer);
  const chefRamsey = await deployRamsey(signer);
  const dummyToken = getERC20WithSigner(DUMMY_TOKEN_ADDRESS, signer);

  return {
    chefRamsey,
    oldRamsey,
    dummyToken,
    signer,
  };
}
