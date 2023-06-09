import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { getTokenBalance } from '../scripts/utils';
import { MAX_UINT256 } from './constants';

describe('Chef Ramsey', () => {
  describe('Emissions', () => {
    it('fsml', async () => {
      const { chefRamsey, oldRamsey, dummyToken, signer } = await loadFixture(freshFixture);
      await oldRamsey.withdrawFromPool(DUMMY_TOKEN_ADDRESS as any);

      await getTokenBalance(DUMMY_TOKEN_ADDRESS, signer.address);

      await dummyToken.approve(chefRamsey.address, MAX_UINT256);
      await chefRamsey.start(DUMMY_TOKEN_ADDRESS, DUMMY_POOL_ID);
    });
  });
});
