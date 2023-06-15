import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { managerFixture } from './fixtures/manager.fixture';
import { expect } from 'chai';
import { createPool } from '../scripts/utils';
import { ethers } from 'hardhat';
import { USDC } from '../scripts/token';
import { parseUnits } from 'ethers/lib/utils';

describe('RewardManager', () => {
  describe('Adding pools', async () => {
    it('factory adds pools at creation time', async () => {
      const { globalRewardManager, lpPoolAddress, factory, signer } = await loadFixture(managerFixture);

      // factory will add pool to global reward manager
      const nftPoolAddress = await createPool(factory.address, lpPoolAddress, globalRewardManager.address, signer);

      expect(await globalRewardManager.getPoolCount()).to.equal(1);
      expect(await globalRewardManager.getPoolAddressByIndex(0)).to.equal(nftPoolAddress);
    });

    it('allows admins to add a pool', async () => {
      const { globalRewardManager, LP_ADDRESSES } = await loadFixture(managerFixture);

      expect(await globalRewardManager.getPoolCount()).to.equal(0);
      await globalRewardManager.addPool(LP_ADDRESSES[0]);
      expect(await globalRewardManager.getPoolCount()).to.equal(1);
    });

    it('reverts when caller is not authorized', async () => {
      const { globalRewardManager, LP_ADDRESSES, accounts } = await loadFixture(managerFixture);

      await expect(globalRewardManager.connect(accounts[0]).addPool(LP_ADDRESSES[1])).to.be.revertedWith(
        'RewardManager: Not an operator'
      );
    });
  });

  describe('token operators', async () => {
    it('adds an operator', async () => {
      const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

      const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[2], globalRewardManager.address, signer);

      const operator = accounts[0];
      // Pool was added at creation
      await globalRewardManager.addApprovedForPool(nftPoolAddress, operator.address);
      const poolOperators = await globalRewardManager.getPoolTokenOperators(nftPoolAddress);
      expect(poolOperators[0]).to.equal(operator.address);
    });

    it('allows operator to add token', async () => {
      const { globalRewardManager, LP_ADDRESSES, factory, signer, accounts } = await loadFixture(managerFixture);

      const nftPoolAddress = await createPool(factory.address, LP_ADDRESSES[3], globalRewardManager.address, signer);
      const operator = accounts[0];
      await globalRewardManager.addApprovedForPool(nftPoolAddress, operator.address);

      await expect(globalRewardManager.connect(operator).addRewardToken(nftPoolAddress, USDC, parseUnits('0.001'))).to
        .not.be.reverted;
      expect(await globalRewardManager.getPoolRewardCount(nftPoolAddress)).to.equal(1);
    });
  });

  describe('pending rewards', async () => {});

  describe('claiming rewards', async () => {});

  describe('reward debts', async () => {});
});
