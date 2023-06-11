import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import { ARX_ADDRESS, DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { addRewardToken, getTokenBalance } from '../scripts/utils';
import { ONE_DAY_SECONDS, ONE_E_18_BN, TEN_POW_18_BN, ZERO_ADDRESS } from './constants';
import { USDC, WBTC, WETH } from '../scripts/token';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { BigNumber } from 'ethers';
import { getAccessControlRevertString, getOneToThePowerOf } from './utils';

describe('Reward manager', () => {
  describe('adding rewards', () => {
    // it('adds additional rewards', async () => {
    //   const { rewardManager } = await loadFixture(awesomeFixture);
    //   const rewardPerSecond = parseUnits('0.01');
    //   await rewardManager.addRewardToken(WBTC, rewardPerSecond);
    //   const tokenAddresses = await rewardManager.getRewardTokenAddresses();
    //   expect(tokenAddresses.length).to.equal(1);
    //   expect(tokenAddresses[0]).to.equal(WBTC);
    //   const rewards = await rewardManager.getRewardTokens();
    //   expect(rewards.length).to.equal(1);
    //   expect(rewards[0].token).to.equal(WBTC);
    //   expect(rewards[0].sharesPerSecond).to.equal(rewardPerSecond);
    // });
    // it('gives correct reward decimal precision', async () => {
    //   const { rewardManager } = await loadFixture(awesomeFixture);
    //   const rewardPerSecond = parseUnits('0.01');
    //   await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //   // Precision determined by:
    //   // uint256(10 ** (uint256(30) - decimalsRewardToken))
    //   const maxDecimals = 30;
    //   // USDC has 6 decimals
    //   const usdcDecimals = 6;
    //   // USDC = 30 - 6 = 24
    //   // USDC precision/scaling factor = 10 ** 24 = 1000000 (in 18 decimal format)
    //   // When divided by 18 decimals = truncates down to 24-18 decimal places = 6
    //   let rewards = await rewardManager.getRewardTokens();
    //   const scalingDiffUSDC = maxDecimals - usdcDecimals;
    //   const expectedPrecisionUSDC = BigNumber.from(10).pow(scalingDiffUSDC);
    //   expect(rewards[0].PRECISION_FACTOR).to.equal(expectedPrecisionUSDC);
    //   // WBTC has 8 decimals on Arbitrum (same as "real" Bitcoin)
    //   await rewardManager.addRewardToken(WBTC, rewardPerSecond);
    //   rewards = await rewardManager.getRewardTokens();
    //   const btcDecimals = 8;
    //   const scalingDiffBTC = maxDecimals - btcDecimals;
    //   const expectedPrecisionBTC = BigNumber.from(10).pow(scalingDiffBTC);
    //   expect(rewards[1].PRECISION_FACTOR).to.equal(expectedPrecisionBTC);
    // });
    //   it('gives correct reward amounts based on token decimal precision', async () => {
    //     const { rewardManager, nftPool, tokenId } = await loadFixture(awesomeFixture);
    //     // The precision factor setup in the contract is aimed at making all math relative to 18 decimals
    //     // formatEther shows correct USDC amount without specifying the decimals
    //     // So contract math is always returning to you the proper scaled amount relative to 18 decimals
    //     // regardless of the tokens decimals
    //     const rewardPerSecond = parseUnits('0.01');
    //     await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //     let pendingAdditionalRewards = await nftPool.pendingAdditionalRewards(tokenId);
    //     let amounts = pendingAdditionalRewards.rewardAmounts;
    //     // Hardhat default has 1 second block time and is triggered/advanced by any transaction
    //     // So 1 tx here has moved time up just one second
    //     expect(amounts[0]).to.equal(rewardPerSecond);
    //     await time.increase(ONE_DAY_SECONDS);
    //     pendingAdditionalRewards = await nftPool.pendingAdditionalRewards(tokenId);
    //     amounts = pendingAdditionalRewards.rewardAmounts;
    //     expect(amounts[0]).to.equal(rewardPerSecond.mul(ONE_DAY_SECONDS).add(rewardPerSecond));
    //   });
  });

  describe('updating rewards', () => {
    // it('updates reward reward rate', async () => {
    //   const { rewardManager } = await loadFixture(awesomeFixture);
    //   const rewardPerSecond = parseUnits('0.01');
    //   await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //   const tokenIndex = 0;
    //   let rewards = await rewardManager.getRewardTokens();
    //   expect(rewards[tokenIndex].sharesPerSecond).to.equal(rewardPerSecond);
    //   const newRewardRate = rewardPerSecond.mul(2);
    //   await rewardManager.updateRewardToken(USDC, tokenIndex, newRewardRate);
    //   rewards = await rewardManager.getRewardTokens();
    //   expect(rewards[tokenIndex].sharesPerSecond).to.equal(newRewardRate);
    // });
    // describe('invalid arguments', () => {
    //   it('reverts when token index is out of bounds', async () => {
    //     const { rewardManager } = await loadFixture(awesomeFixture);
    //     const rewardPerSecond = parseUnits('0.01');
    //     await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //     const invalidIndex = 1;
    //     await expect(rewardManager.updateRewardToken(USDC, invalidIndex, rewardPerSecond)).to.be.revertedWith(
    //       'Invalid token index'
    //     );
    //   });
    //   it('reverts when token addresses has not been added', async () => {
    //     const { rewardManager } = await loadFixture(awesomeFixture);
    //     const rewardPerSecond = parseUnits('0.01');
    //     await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //     const invalidToken = WBTC;
    //     await expect(rewardManager.updateRewardToken(invalidToken, 0, rewardPerSecond)).to.be.revertedWith(
    //       'Token not added'
    //     );
    //   });
    //   it('reverts when token addresses is zero address', async () => {
    //     const { rewardManager } = await loadFixture(awesomeFixture);
    //     const rewardPerSecond = parseUnits('0.01');
    //     await rewardManager.addRewardToken(USDC, rewardPerSecond);
    //     const invalidToken = ZERO_ADDRESS;
    //     await expect(rewardManager.updateRewardToken(invalidToken, 0, rewardPerSecond)).to.be.revertedWith(
    //       'Token not provided'
    //     );
    //   });
    // });
  });

  describe('removing rewards', () => {
    describe('authorization', () => {
      // it('reverts when caller is not the treasury', async () => {
      //   const { rewardManager, randomAccount } = await loadFixture(awesomeFixture);

      //   // Dont need to bothering adding token first for this check
      //   await expect(rewardManager.connect(randomAccount).removeRewardToken(USDC, 0)).to.be.revertedWith(
      //     'Only treasury'
      //   );
      // });

      // it('reverts  when token index is out of bounds', async () => {
      //   const { rewardManager } = await loadFixture(awesomeFixture);

      //   const rewardPerSecond = parseUnits('0.01');
      //   await rewardManager.addRewardToken(USDC, rewardPerSecond);

      //   const invalidIndex = 1;
      //   await expect(rewardManager.removeRewardToken(USDC, invalidIndex)).to.be.revertedWith('Invalid token index');
      // });

      it('removes token when caller is the treasury', async () => {
        const { rewardManager } = await loadFixture(awesomeFixture);

        const rewardPerSecond = parseUnits('0.01');
        await rewardManager.addRewardToken(USDC, rewardPerSecond);

        let rewards = await rewardManager.getRewardTokens();
        let rewardAddresses = await rewardManager.getRewardTokenAddresses();

        // sanity check
        expect(rewards.length).to.equal(1);
        expect(rewardAddresses.length).to.equal(1);

        await rewardManager.removeRewardToken(USDC, 0);

        await rewardManager.addRewardToken(WBTC, rewardPerSecond);

        rewards = await rewardManager.getRewardTokens();
        rewardAddresses = await rewardManager.getRewardTokenAddresses();

        console.log(rewards);

        // Associated address should be removed from the address set as well

        // expect(rewards.length).to.equal(0);
        // expect(rewardAddresses.length).to.equal(0);
      });

      // it('removes the associated token address', async () => {
      //   const { nftPool, tokenId, signer, rewardManager } = await loadFixture(awesomeFixture);

      //   expect(false).to.be.true;
      // });

      // it('transfer contract token balance to the treasury', async () => {
      //   const { nftPool, tokenId, signer, rewardManager } = await loadFixture(awesomeFixture);

      //   expect(false).to.be.true;
      // });
    });
  });
});
