import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';

describe('Chef Ramsey', () => {
  describe('Emissions', () => {
    it('fsml', async () => {
      const { chefRamsey } = await loadFixture(freshFixture);
    });
  });
});
