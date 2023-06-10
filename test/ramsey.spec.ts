import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { formatEther } from 'ethers/lib/utils';
import { freshFixture } from './fixtures/fresh.fixture';
import { ARX_ADDRESS, DUMMY_POOL_ID, DUMMY_TOKEN_ADDRESS } from '../scripts/constants';
import { getTokenBalance } from '../scripts/utils';
import { ONE_DAY_SECONDS } from './constants';
import { WETH } from '../scripts/token';

describe('Chef Ramsey', () => {
  // describe('Emissions', () => {
  //   it('has an emission rate', async () => {
  //     const { chefRamsey } = await loadFixture(freshFixture);

  //     expect(await chefRamsey.emissionRate()).to.be.greaterThan(0);
  //   });
  // });

  // describe('Rewards', () => {
  //   it('harvest from main chef', async () => {
  //     const { chefRamsey } = await loadFixture(freshFixture);

  //     let pendingRewards = await chefRamsey.getPendingRewards();
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));

  //     await time.increase(ONE_DAY_SECONDS);

  //     pendingRewards = await chefRamsey.getPendingRewards();
  //     expect(pendingRewards.pendingArx).to.be.greaterThan(0);
  //     expect(pendingRewards.pendingWETH).to.be.greaterThan(0);
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));

  //     await chefRamsey.harvest();

  //     pendingRewards = await chefRamsey.getPendingRewards();
  //     expect(pendingRewards.pendingArx).to.be.equal(0);
  //     expect(pendingRewards.pendingWETH).to.be.equal(0);
  //     console.log('ARX: ' + formatEther(pendingRewards.pendingArx));
  //     console.log('WETH: ' + formatEther(pendingRewards.pendingWETH));
  //   });
  // });

  describe('Pool positions', () => {
    describe('Rewards', () => {
      // it('accumulates rewards', async () => {
      //   const { nftPool, tokenId, chefRamsey } = await loadFixture(freshFixture);

      //   let pendingRewards = await nftPool.pendingRewards(tokenId);
      //   console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
      //   console.log('WETH: ' + formatEther(pendingRewards.wethAmount));

      //   await time.increase(ONE_DAY_SECONDS);

      //   await chefRamsey.updatePool(nftPool.address);

      //   pendingRewards = await nftPool.pendingRewards(tokenId);
      //   console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
      //   console.log('WETH: ' + formatEther(pendingRewards.wethAmount));
      // });

      it('lets position claim rewards', async () => {
        const { nftPool, tokenId, chefRamsey, signer } = await loadFixture(freshFixture);

        // Position already created in fixture

        console.log('User pending rewards:');
        let pendingRewards = await nftPool.pendingRewards(tokenId);
        console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
        console.log('WETH: ' + formatEther(pendingRewards.wethAmount));

        await time.increase(ONE_DAY_SECONDS);

        pendingRewards = await nftPool.pendingRewards(tokenId);
        console.log('ARX: ' + formatEther(pendingRewards.mainAmount));
        console.log('WETH: ' + formatEther(pendingRewards.wethAmount));

        console.log('User balances:');
        let mainBalance = await getTokenBalance(ARX_ADDRESS, signer.address, signer);
        let wethBalance = await getTokenBalance(WETH, signer.address, signer);
        console.log('USER ARX: ' + formatEther(mainBalance));
        console.log('USER WETH: ' + formatEther(wethBalance));

        await nftPool.harvestPosition(tokenId);

        mainBalance = await getTokenBalance(ARX_ADDRESS, signer.address, signer);
        wethBalance = await getTokenBalance(WETH, signer.address, signer);
        console.log('USER ARX: ' + formatEther(mainBalance));
        console.log('USER WETH: ' + formatEther(wethBalance));
      });
    });

    // describe('Additonal rewards', () => {
    //   it('accumulates additional rewards', async () => {
    //     const { nftPool, tokenId, chefRamsey } = await loadFixture(freshFixture);

    //   });

    //   it('lets position claim additional rewards', async () => {
    //     const { nftPool, tokenId, chefRamsey } = await loadFixture(freshFixture);
    //   });
    // });
  });
});
