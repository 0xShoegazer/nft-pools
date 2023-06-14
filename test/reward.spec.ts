import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import { ARX_ADDRESS, DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { addRewardToken, getERC20, getTokenBalance } from '../scripts/utils';
import {
  MAX_UINT256,
  ONE_DAY_SECONDS,
  ONE_E_18_BN,
  TEN_POW_18_BN,
  USDC_ARBITRUM_BALANCE_SLOT,
  USDC_BALANCEOF_SLOT,
  ZERO_ADDRESS,
} from './constants';
import { USDC, WBTC, WETH } from '../scripts/token';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { BigNumber } from 'ethers';
import { getAccessControlRevertString, giveTokens, updateStorageSlot } from './utils';

describe('Rewards', () => {
  describe('multiple positions reward debt', () => {
    // it('updates state correctly at actions time', async () => {
    //   const { rewardManager, signer, nftPool, tokenId } = await loadFixture(awesomeFixture);

    //   // test user alone in pool, withdraw, do they receive their proper amount of tokens?

    //   const rewardPerSecond = parseUnits('0.01');
    //   const rewardToken = USDC;
    //   await rewardManager.addRewardToken(USDC, rewardPerSecond);

    //   // give contract reward amounts to distribute
    //   await giveTokens(USDC, USDC_ARBITRUM_BALANCE_SLOT, rewardManager.address, parseUnits('1000'));

    //   // position already created
    //   // fast forward, check pending, claim, check balance

    //   await time.increase(ONE_DAY_SECONDS);
    //   console.log(`
    //   `);
    //   console.log('ONE DAY LATER..');

    //   let pendingRewards = await nftPool.pendingAdditionalRewards(tokenId);
    //   console.log('user pending reward: ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   // claim
    //   await nftPool.harvestPosition(tokenId);
    //   pendingRewards = await nftPool.pendingAdditionalRewards(tokenId);
    //   console.log('user pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   // check balances
    //   const usdcToken = getERC20(USDC, signer);
    //   let balance = await usdcToken.balanceOf(signer.address);
    //   console.log('user usdc after claim: ' + formatEther(balance));
    //   balance = await usdcToken.balanceOf(rewardManager.address);
    //   console.log('contract usdc after claim: ' + formatEther(balance));
    // });

    it('updates state correctly at actions time with multiple depositors', async () => {
      const { rewardManager, signer, nftPool, tokenId, lpInstance, randomAccount, lpBalanceRandomAccount } =
        await loadFixture(awesomeFixture);

      // test user alone in pool, withdraw, do they receive their proper amount of tokens?

      const rewardPerSecond = parseUnits('0.01');
      const rewardToken = USDC;
      await rewardManager.addRewardToken(USDC, rewardPerSecond);

      // give contract reward amounts to distribute
      await giveTokens(USDC, USDC_ARBITRUM_BALANCE_SLOT, rewardManager.address, parseUnits('1000'));

      // position already created
      // fast forward, check pending, claim, check balance

      await time.increase(ONE_DAY_SECONDS / 2);
      console.log(`
      `);
      console.log('12 HOURS LATER..');

      // do additional deposit
      await lpInstance.connect(randomAccount).approve(nftPool.address, MAX_UINT256);
      await nftPool.connect(randomAccount).createPosition(lpBalanceRandomAccount, 0);

      const userOneTokenId = tokenId;
      const userTwoTokenId = 2; // we know this from test setup

      // claim for one, move up a little, claim for other, make sure all is lining up correctly

      let pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
      console.log('user pending reward: ' + formatEther(pendingRewards.rewardAmounts[0]));

      let debt = await rewardManager.positionRewardDebts(userTwoTokenId, rewardToken);
      console.log('user 2 reward debt: ' + formatEther(debt));

      await time.increase(ONE_DAY_SECONDS / 2);
      console.log(`
      `);
      console.log('12 HOURS LATER..');

      pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
      console.log('user 1 pending reward: ' + formatEther(pendingRewards.rewardAmounts[0]));
      pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
      console.log('user 2 pending reward: ' + formatEther(pendingRewards.rewardAmounts[0]));

      console.log(`
      `);
      console.log('Claiming user 1..');

      // claim
      await nftPool.connect(signer).harvestPosition(tokenId);
      await time.increase(1);

      // check balances
      const usdcToken = getERC20(USDC, signer);
      let balance = await usdcToken.balanceOf(signer.address);
      console.log('user 1 usdc after claim: ' + formatEther(balance));
      balance = await usdcToken.balanceOf(rewardManager.address);
      console.log('contract usdc after claim: ' + formatEther(balance));

      pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
      console.log('user 1 pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));
      pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
      console.log('user 2 pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));

      console.log(`
      `);
      console.log('Claiming user 2..');
      await nftPool.connect(randomAccount).harvestPosition(userTwoTokenId);
      await time.increase(1);

      pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
      console.log('user 1 pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));
      pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
      console.log('user 2 pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));

      balance = await usdcToken.balanceOf(randomAccount.address);
      console.log('user 2 usdc after claim: ' + formatEther(balance));
      balance = await usdcToken.balanceOf(rewardManager.address);
      console.log('contract usdc after claim: ' + formatEther(balance));

      // check reward debt
    });

    // it('fuckin works', async () => {
    //   const { rewardManager, randomAccount, signer, nftPool, tokenId, lpInstance, lpBalanceRandomAccount } =
    //     await loadFixture(awesomeFixture);

    //   const usdcToken = getERC20(USDC, signer);

    //   // give contract reward amounts to distribute
    //   await giveTokens(USDC, USDC_ARBITRUM_BALANCE_SLOT, rewardManager.address, parseUnits('1000'));

    //   const rewardPerSecond = parseUnits('0.01');
    //   const rewardToken = USDC;
    //   await rewardManager.addRewardToken(USDC, rewardPerSecond);

    //   let debt = await rewardManager.positionRewardDebts(tokenId, rewardToken);
    //   console.log('current reward debt: ' + formatEther(debt));

    //   await time.increase(ONE_DAY_SECONDS);
    //   console.log(`
    //   `);

    //   const userOneTokenId = tokenId;
    //   const userTwoTokenId = 2; // we know this from test setup

    //   let pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
    //   console.log('user 1 before user 2 deposit: ' + formatEther(pendingRewards.rewardAmounts[0])); // 864.01

    //   // do additional deposit
    //   await lpInstance.connect(randomAccount).approve(nftPool.address, MAX_UINT256);
    //   await nftPool.connect(randomAccount).createPosition(lpBalanceRandomAccount, 0);

    //   debt = await rewardManager.positionRewardDebts(userTwoTokenId, rewardToken);
    //   console.log('user 2 reward debt after deposit: ' + formatEther(debt));

    //   debt = await rewardManager.positionRewardDebts(userOneTokenId, rewardToken);
    //   console.log('user 1 reward debt after deposit: ' + formatEther(debt));

    //   pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
    //   console.log('user 1 pending after user 2 deposit(immediately): ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
    //   console.log('user 2 pending after their deposit(immediately): ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   await time.increase(1);
    //   console.log(`
    //   `);
    //   console.log('ONE SECOND LATER..');

    //   pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
    //   console.log('user 1 pending: ' + formatEther(pendingRewards.rewardAmounts[0]));
    //   pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
    //   console.log('user 2 pending: ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   // usdcBalance = await usdcToken.balanceOf(rewardManager.address);
    //   // console.log('contract usdc balance: ' + formatEther(usdcBalance));
    //   // usdcBalance = await usdcToken.balanceOf(signer.address);
    //   // console.log('user 1 usdc balance: ' + formatEther(usdcBalance));
    //   // usdcBalance = await usdcToken.balanceOf(randomAccount.address);
    //   // console.log('user 2 usdc balance: ' + formatEther(usdcBalance));

    //   await time.increase(1);
    //   console.log(`
    //   `);
    //   console.log('ONE SECOND LATER..');

    //   pendingRewards = await nftPool.pendingAdditionalRewards(userOneTokenId);
    //   console.log('user 1 pending: ' + formatEther(pendingRewards.rewardAmounts[0]));
    //   pendingRewards = await nftPool.pendingAdditionalRewards(userTwoTokenId);
    //   console.log('user 2 pending: ' + formatEther(pendingRewards.rewardAmounts[0]));

    //   // TODO: Need to fix order of events. update pool (accPers), harvest and position pending, then update debt

    //   // test user alone in pool, withdraw, do they receive their tokens?
    // });
  });
});
