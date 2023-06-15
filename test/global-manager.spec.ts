import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { managerFixture } from './fixtures/manager.fixture';

describe('RewardManager', () => {
  describe('adding pools', async () => {
    const { globalRewardManager, nftPool } = await loadFixture(managerFixture);

    await globalRewardManager.addPool(nftPool.address);
  });

  describe('pending rewards', async () => {});

  describe('claiming rewards', async () => {});

  describe('reward debts', async () => {});
});
