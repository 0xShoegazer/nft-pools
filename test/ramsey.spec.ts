import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { getTokenBalance } from '../scripts/utils';
import { ONE_DAY_SECONDS } from './constants';

describe('Chef Ramsey', () => {
  describe('Emissions', () => {
    it('has an emission rate', async () => {
      const { chefRamsey } = await loadFixture(freshFixture);

      expect(await chefRamsey.emissionRate()).to.be.greaterThan(0);
    });
  });

  describe('Rewards', () => {
    it('harvest from main chef', async () => {
      const { chefRamsey, oldRamsey, dummyToken, signer, mainChef, tokenId } = await loadFixture(freshFixture);
    });
  });
});
