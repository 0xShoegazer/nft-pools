import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { managerFixture } from './fixtures/manager.fixture';
import { expect } from 'chai';
import { createPool, createPoolWithInstance, createPosition } from '../scripts/utils';
import { ethers } from 'hardhat';
import { USDC } from '../scripts/token';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { giveTokenBalanceFor, giveTokens } from './utils';
import { ONE_DAY_SECONDS, UNIV2_POOL_BALANCEOF_SLOT } from './constants';
import { xPools } from '../scripts/xPools';

describe('RewardManager', () => {
  // describe('Adding pools', async () => {
  //   it('factory adds pools at creation time', async () => {
  //     const { globalRewardManager, lpPoolAddress, factory, signer } = await loadFixture(managerFixture);

  //     // factory will add pool to global reward manager
  //     const nftPoolAddress = await createPool(factory.address, lpPoolAddress, globalRewardManager.address, signer);

  //     expect(await globalRewardManager.getPoolCount()).to.equal(1);
  //     expect(await globalRewardManager.getPoolAddressByIndex(0)).to.equal(nftPoolAddress);
  //   });

  //   it('allows admins to add a pool', async () => {
  //     const { globalRewardManager, LP_ADDRESSES } = await loadFixture(managerFixture);

  //     expect(await globalRewardManager.getPoolCount()).to.equal(0);
  //     await globalRewardManager.addPool(LP_ADDRESSES[0]);
  //     expect(await globalRewardManager.getPoolCount()).to.equal(1);
  //   });

  //   it('reverts when caller is not authorized', async () => {
  //     const { globalRewardManager, LP_ADDRESSES, accounts } = await loadFixture(managerFixture);

  //     await expect(globalRewardManager.connect(accounts[0]).addPool(LP_ADDRESSES[1])).to.be.revertedWith(
  //       'RewardManager: Not an operator'
  //     );
  //   });
  // });

  // describe('token operators', async () => {
  //   it('adds an operator', async () => {
  //     const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

  //     const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[2], globalRewardManager.address, signer);

  //     const operator = accounts[0];
  //     // Pool was added at creation
  //     await globalRewardManager.addApprovedForPool(nftPoolAddress, operator.address);
  //     const poolOperators = await globalRewardManager.getPoolTokenOperators(nftPoolAddress);
  //     expect(poolOperators[0]).to.equal(operator.address);
  //   });

  //   it('allows operator to add token', async () => {
  //     const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

  //     const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[3], globalRewardManager.address, signer);
  //     const operator = accounts[0];
  //     await globalRewardManager.addApprovedForPool(nftPoolAddress, operator.address);

  //     await expect(globalRewardManager.connect(operator).addRewardToken(nftPoolAddress, USDC, parseUnits('0.001'))).to
  //       .not.be.reverted;
  //     expect(await globalRewardManager.getPoolRewardCount(nftPoolAddress)).to.equal(1);
  //   });

  //   it('allows operator to update token', async () => {
  //     const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

  //     const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[3], globalRewardManager.address, signer);
  //     const operator = accounts[0];
  //     await globalRewardManager.addApprovedForPool(nftPoolAddress, operator.address);

  //     const rewardToken = USDC;
  //     await globalRewardManager.connect(operator).addRewardToken(nftPoolAddress, rewardToken, parseUnits('0.001'));

  //     const newRewardRate = parseUnits('0.0000001');
  //     await expect(globalRewardManager.connect(operator).updateRewardToken(nftPoolAddress, rewardToken, newRewardRate))
  //       .to.not.be.reverted;

  //     const reward = await globalRewardManager.getPoolRewardTokenInfo(nftPoolAddress, rewardToken);
  //     expect(reward.sharesPerSecond).to.equal(newRewardRate);
  //   });

  //   it('reverts if operator is not approved', async () => {
  //     const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

  //     const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[4], globalRewardManager.address, signer);
  //     const hackerOperator = accounts[0];

  //     await expect(
  //       globalRewardManager.connect(hackerOperator).addRewardToken(nftPoolAddress, USDC, parseUnits('0.001'))
  //     ).to.be.revertedWith('Not a token operator');
  //   });
  // });

  describe('pool rewards', async () => {
    it('accumulates rewards', async () => {
      const { globalRewardManager, factory, signer, userOneLpBalance } = await loadFixture(managerFixture);

      const lpPoolAddress = xPools.ARX_USDC.lpPoolAddress;
      const { nftPool, lpInstance } = await createPoolWithInstance(
        factory.address,
        lpPoolAddress,
        globalRewardManager.address,
        signer
      );

      // add reward
      const rewardPerSecond = parseUnits('0.00001');
      const rewardToken = USDC;
      await globalRewardManager.addRewardToken(nftPool.address, rewardToken, rewardPerSecond);

      // create position
      const tokenId = await createPosition(nftPool.address, lpPoolAddress, userOneLpBalance, signer);

      let debt = await globalRewardManager.positionRewardDebts(nftPool.address, tokenId, rewardToken);
      console.log('debt: ' + formatEther(debt));

      let pendingAdditional = await nftPool.pendingAdditionalRewards(tokenId);
      console.log('pending: ' + formatEther(pendingAdditional.rewardAmounts[0]));

      await time.increase(ONE_DAY_SECONDS);
      console.log(`
      ONE DAY LATER..`);

      pendingAdditional = await nftPool.pendingAdditionalRewards(tokenId);
      console.log('pending: ' + formatEther(pendingAdditional.rewardAmounts[0]));
    });
  });
});
