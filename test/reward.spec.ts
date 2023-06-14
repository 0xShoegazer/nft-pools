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
    it('updates state correctly at actions time', async () => {
      const { rewardManager, signer, nftPool, tokenId } = await loadFixture(awesomeFixture);

      // TODO: Need to fix order of events. update pool (accPers), harvest and position pending, then update debt
      // test user alone in pool, withdraw, do they receive their tokens?

      // const rewardPerSecond = parseUnits('0.01');
      // const rewardToken = USDC;
      // await rewardManager.addRewardToken(USDC, rewardPerSecond);

      // // give contract reward amounts to distribute
      // await giveTokens(USDC, USDC_ARBITRUM_BALANCE_SLOT, rewardManager.address, parseUnits('1000'));

      // // position already created
      // // fast forward, check pending, claim, check balance

      // await time.increase(ONE_DAY_SECONDS);
      // console.log(`
      // `);
      // console.log('ONE DAY LATER..');

      // let pendingRewards = await nftPool.pendingAdditionalRewards(tokenId);
      // console.log('user pending reward: ' + formatEther(pendingRewards.rewardAmounts[0]));

      // // claim
      // await nftPool.harvestPosition(tokenId);
      // pendingRewards = await nftPool.pendingAdditionalRewards(tokenId);
      // console.log('user pending after claim: ' + formatEther(pendingRewards.rewardAmounts[0]));

      // check balance and reward debt

      const usdcToken = getERC20(USDC, signer);
    });

    // it('fuckin works', async () => {
    //   const { rewardManager, randomAccount, signer, nftPool, tokenId, lpInstance, lpBalanceRandomAccount } =
    //     await loadFixture(awesomeFixture);

    //   const usdcToken = getERC20(USDC, signer);

    //   // give contract reward amounts to distribute
    //   await giveTokens(USDC, USDC_ARBITRUM_BALANCE_SLOT, rewardManager.address, parseUnits('1000'));

    //   let usdcBalance = await usdcToken.balanceOf(rewardManager.address);
    //   console.log('contract usdc balance: ' + formatEther(usdcBalance));
    //   usdcBalance = await usdcToken.balanceOf(signer.address);
    //   console.log('user 1 usdc balance: ' + formatEther(usdcBalance));
    //   usdcBalance = await usdcToken.balanceOf(randomAccount.address);
    //   console.log('user 2 usdc balance: ' + formatEther(usdcBalance));

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