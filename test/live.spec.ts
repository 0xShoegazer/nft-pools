import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { ARX_ADDRESS, DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { addRewardToken, getTokenBalance } from '../scripts/utils';
import { ONE_DAY_SECONDS } from './constants';
import { WBTC, WETH } from '../scripts/token';
import { liveItemsFixture } from './fixtures/live-items.fixture';

describe('Live shit', () => {
  describe('Pool positions', () => {
    describe('Additonal rewards', () => {
      it('accumulates additional rewards', async () => {
        const { nftPool, tokenId, signer, rewardManager } = await loadFixture(liveItemsFixture);

        await addRewardToken(rewardManager.address, WBTC, parseUnits('0.01'), signer);

        await time.increase(ONE_DAY_SECONDS);

        // Position already created in fixture
        console.log('User pending regualr rewards:');
        let pendingRewards = await nftPool.pendingRewards(tokenId);
        console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
        console.log('WETH: ' + formatEther(pendingRewards.wethAmount));

        console.log('User pending additional  rewards:');
        let pendingAdditonalRewards = await nftPool.pendingAdditionalRewards(tokenId);
        console.log(
          pendingAdditonalRewards.rewardAmounts.map((amt, idx) => {
            return {
              token: pendingAdditonalRewards.tokens[idx],
              amount: formatEther(amt),
            };
          })
        );

        // TODO: TEST XTOKEN CLAIM/CONVERT SHIT

        // await time.increase(ONE_DAY_SECONDS);
      });
    });
  });
});
