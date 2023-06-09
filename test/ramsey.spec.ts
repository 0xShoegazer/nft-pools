import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { getTokenBalance } from '../scripts/utils';
import { MAX_UINT256, ONE_DAY_SECONDS } from './constants';

describe('Chef Ramsey', () => {
  describe('Emissions', () => {
    it('fsml', async () => {
      const { chefRamsey, oldRamsey, dummyToken, signer, mainChef } = await loadFixture(freshFixture);

      // let pendingArx = await mainChef.pendingArx(DUMMY_POOL_ID, chefRamsey.address);
      // console.log(formatEther(pendingArx));

      // await time.increase(ONE_DAY_SECONDS);

      // pendingArx = await mainChef.pendingArx(DUMMY_POOL_ID, chefRamsey.address);
      // console.log(formatEther(pendingArx));

      // console.log(formatEther(await chefRamsey.emissionRate()));
      expect(await chefRamsey.emissionRate()).to.be.greaterThan(0);
    });
  });
});
