import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { formatEther } from 'ethers/lib/utils';
import { ONE_DAY_SECONDS } from './constants';

describe('NFT Pools', () => {
  describe('Rewards', () => {
    // it('updates reward amounts over time', async () => {
    //   const { nftPool, tokenId } = await loadFixture(awesomeFixture);

    //   const pendingBefore = await nftPool.pendingAdditionalRewards(tokenId);
    //   console.log(pendingBefore);

    //   await time.increase(ONE_DAY_SECONDS);

    //   const pendingAfter = await nftPool.pendingAdditionalRewards(tokenId);
    //   console.log(pendingAfter);

    //   expect(pendingAfter.rewardAmounts[0]).to.be.greaterThan(pendingBefore.rewardAmounts[0]);
    // });

    it('gives token and xtoken rewards', async () => {
      const {} = await loadFixture(awesomeFixture);

      // const position = await nftPool.getStakingPosition(tokenId);
      // // console.log(position);

      // const poolInfo = await chefRamsey.getPoolInfo(nftPool.address);
      // console.log(poolInfo);

      // const rate = await chefRamsey.emissionRate();
      // console.log(rate);

      // const ogPoolInfo = await oldChef.poolInfo(33);
      // console.log(ogPoolInfo);

      // const oldTotal = await oldChef.arxTotalAllocPoint();

      // let pendingGrails = await nftPool.pendingRewards(tokenId);
      // console.log(pendingGrails);

      // await time.increase(ONE_DAY_SECONDS);

      // pendingGrails = await nftPool.pendingRewards(tokenId);
      // console.log(pendingGrails);
    });
  });
});
