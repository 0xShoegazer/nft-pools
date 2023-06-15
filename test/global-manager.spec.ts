import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { managerFixture } from './fixtures/manager.fixture';
import { expect } from 'chai';
import { createPool } from '../scripts/utils';

describe('RewardManager', () => {
  describe('Adding pools', async () => {
    it('factory adds pools at creation time', async () => {
      const { globalRewardManager, lpPoolAddress, factory, signer } = await loadFixture(managerFixture);
      // await globalRewardManager.addPool(nftPoolAddress);

      // factory will add pool to global reward manager
      await createPool(factory.address, lpPoolAddress, globalRewardManager.address, signer);

      expect(await globalRewardManager.getPoolCount()).to.equal(1);
    });

    it('allows admins to add a pool', async () => {
      const { globalRewardManager, lpPoolAddress, factory, signer } = await loadFixture(managerFixture);

      // contracts are set with admin signer at this point
      const nftPoolAddress: string = await createPool(
        factory.address,
        lpPoolAddress,
        globalRewardManager.address,
        signer
      );

      await globalRewardManager.addPool(nftPoolAddress);

      expect(await globalRewardManager.getPoolCount()).to.equal(1);
    });
  });

  describe('pending rewards', async () => {});

  describe('claiming rewards', async () => {});

  describe('reward debts', async () => {});
});
