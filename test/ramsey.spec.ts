import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { getTokenBalance } from '../scripts/utils';
import { ONE_DAY_SECONDS } from './constants';

describe('Chef Ramsey', () => {
  // describe('Emissions', () => {
  //   it('has an emission rate', async () => {
  //     const { chefRamsey } = await loadFixture(freshFixture);

  //     expect(await chefRamsey.emissionRate()).to.be.greaterThan(0);
  //   });
  // });

  // describe('Rewards', () => {
  //   it('harvest from main chef', async () => {
  //     const { chefRamsey } = await loadFixture(freshFixture);

  //     let pendingRewards = await chefRamsey.getPendingRewards();
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));

  //     await time.increase(ONE_DAY_SECONDS);

  //     pendingRewards = await chefRamsey.getPendingRewards();
  //     expect(pendingRewards.pendingArx).to.be.greaterThan(0);
  //     expect(pendingRewards.pendingWETH).to.be.greaterThan(0);
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));

  //     await chefRamsey.harvest();

  //     pendingRewards = await chefRamsey.getPendingRewards();
  //     expect(pendingRewards.pendingArx).to.be.equal(0);
  //     expect(pendingRewards.pendingWETH).to.be.equal(0);
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));
  //   });
  // });

  describe('Pool positions', () => {
    it('accumulates rewards', async () => {
      const { nftPool, tokenId, chefRamsey } = await loadFixture(freshFixture);
      const position = await nftPool.getStakingPosition(tokenId);
      console.log(position);
      let pendingRewards = await nftPool.pendingRewards(tokenId);
      console.log(pendingRewards);

      await time.increase(ONE_DAY_SECONDS);

      await chefRamsey.updatePool(nftPool.address);

      pendingRewards = await nftPool.pendingRewards(tokenId);
      console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
      console.log('WETH: ' + formatEther(pendingRewards.wethAmount));
    });
  });
});
