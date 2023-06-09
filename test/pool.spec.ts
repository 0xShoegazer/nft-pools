import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { formatEther } from 'ethers/lib/utils';
import { ONE_DAY_SECONDS } from './constants';

describe('NFT Pools', () => {
  describe('Rewards', () => {
    it('updates reward amounts over time', async () => {
      const { nftPool, tokenId } = await loadFixture(awesomeFixture);

      let pending = await nftPool.pendingAdditionalRewards(tokenId);
      console.log(pending);

      await time.increase(ONE_DAY_SECONDS);

      pending = await nftPool.pendingAdditionalRewards(tokenId);
      console.log(pending);
    });
  });
});
