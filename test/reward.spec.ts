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
  USDC_BALANCEOF_SLOT,
  ZERO_ADDRESS,
} from './constants';
import { USDC, WBTC, WETH } from '../scripts/token';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { BigNumber } from 'ethers';
import { getAccessControlRevertString, getOneToThePowerOf, giveTokenBalanceFor } from './utils';

describe('Rewards', () => {
  describe('multiple positions reward debt', () => {
    it('fuckin works', async () => {
      const { rewardManager, randomAccount, signer, nftPool, tokenId, lpInstance, lpBalanceRandomAccount } =
        await loadFixture(awesomeFixture);

      // add token
      // let current user accrue rewards
      // Create position for random
      // See if that nukes the other pending afterwards

      const rewardPerSecond = parseUnits('0.01');
      const rewardToken = WBTC;
      await rewardManager.addRewardToken(WBTC, rewardPerSecond);

      let debt = await rewardManager.positionRewardDebts(tokenId, rewardToken);
      console.log('current reward debt: ' + formatEther(debt));

      await time.increase(ONE_DAY_SECONDS);

      console.log('ONE DAY LATER..');
      let userOnePending = await nftPool.pendingAdditionalRewards(tokenId);
      let amounts = userOnePending.rewardAmounts;
      console.log('userOnePending before other deposit: ' + formatEther(amounts[0])); // 864.01

      await lpInstance.connect(randomAccount).approve(nftPool.address, MAX_UINT256);
      await nftPool.connect(randomAccount).createPosition(lpBalanceRandomAccount, 0);
      const newTokenId = 2; // we know this from test setup

      debt = await rewardManager.positionRewardDebts(newTokenId, rewardToken);
      console.log('other reward debt after deposit: ' + formatEther(debt));

      debt = await rewardManager.positionRewardDebts(newTokenId, rewardToken);
      console.log('previous positions reward debt after deposit: ' + formatEther(debt));

      // userOnePending = await nftPool.pendingAdditionalRewards(tokenId);
      // amounts = userOnePending.rewardAmounts;
      // console.log('userOnePending after other deposit(immediately): ' + formatEther(amounts[0])); // 0.. fucked

      // Still fucked after changing function call order

      // Deposit:
      // update pool. updates reward per share and last reward time
      // user pending are sentat that time ***
      // reward debt is then updated after users total deposit and overall deposits are updated

      // pool claiming triggers lastRewardTime update in chef
      // This needs to happen before any new user actions
    });
  });
});
