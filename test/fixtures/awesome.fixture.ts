import { impersonateAccount, setBalance } from '@nomicfoundation/hardhat-network-helpers';
import { ARBIDEX_TREASURY, ARX_ADDRESS, CHEF_RAMSEY_ADDRESS, xARX_ADDRESS } from '../../scripts/constants';
import { ethers } from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { createPool, deployPoolFactory, deployYieldBooster } from '../../scripts/utils';
import { xPools } from '../../scripts/xPools';

export async function awesomeFixture() {
  await impersonateAccount(ARBIDEX_TREASURY);
  const signer = await ethers.getSigner(ARBIDEX_TREASURY);
  await setBalance(ARBIDEX_TREASURY, parseUnits('10000'));

  // cant add the pool until the dummy token is deployed
  const [yieldBooster] = await Promise.all([deployYieldBooster(xARX_ADDRESS)]);

  const factory = await deployPoolFactory(CHEF_RAMSEY_ADDRESS, ARX_ADDRESS, xARX_ADDRESS);
  const poolAddress: string = await createPool(factory.address, xPools.WETH_USDC.lpPoolAddress);

  return {
    factory,
    yieldBooster,
    poolAddress,
    signer,
  };
}
