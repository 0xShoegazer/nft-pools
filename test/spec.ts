import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { testFixture } from './fixtures/awesome.fixture';
import { increase, latest } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';
import { expect } from 'chai';
import { ONE_DAY_SECONDS } from './constants';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

describe('The Situation', () => {
  // it('set the chef on token ', async () => {
  //   const { signer, nftPool, masterChef, BaseXToken, xBSXToken } = await loadFixture(testFixture);

  //   // initializeMasterAddress
  //   // initializeEmissionStart

  //   await BaseXToken.initializeMasterAddress(masterChef.address);
  //   expect(await BaseXToken.masterAddress()).to.equal(masterChef.address);

  //   const start = await latest();
  //   await BaseXToken.initializeEmissionStart(start + 10);
  // });

  // it('should accumulate both tokens', async () => {
  //   const { signer, nftPool, masterChef, tokenId } = await loadFixture(testFixture);

  //   let pending = await nftPool.pendingRewards(tokenId);
  //   console.log(pending);

  //   await increase(ONE_DAY_SECONDS);

  //   pending = await nftPool.pendingRewards(tokenId);
  //   console.log(pending);
  // });

  // it('updates a pool with blowing up', async () => {
  //   const {  nftPool, masterChef, bswapToken } = await loadFixture(testFixture);

  //   let poolInfo = await masterChef.getPoolInfo(nftPool.address);
  //   console.log(poolInfo);
  //   expect(poolInfo.reserve).to.equal(0);

  //   const emissionRates = await masterChef.emissionRates();
  //   const mainRate = emissionRates.mainRate;
  //   const wethRate = emissionRates.wethRate;

  //   // console.log(formatUnits(mainRate));
  //   // console.log(formatUnits(wethRate));

  //   await increase(ONE_DAY_SECONDS);

  //   const mainReserve = mainRate.mul(ONE_DAY_SECONDS);
  //   const wethReserve = wethRate.mul(ONE_DAY_SECONDS);
  //   console.log(formatUnits(mainReserve));
  //   console.log(formatUnits(wethReserve));

  //   await masterChef.updatePool(nftPool.address);

  //   poolInfo = await masterChef.getPoolInfo(nftPool.address);
  //   console.log(poolInfo);
  //   const pMain = poolInfo.reserve;
  //   const pWeth = poolInfo.reserveWETH;

  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pWeth));

  // });

  // it('updates harvest from old chef', async () => {
  //   const { nftPool, masterChef, bswapToken, oldChef, oldChefPid } = await loadFixture(testFixture);

  //   // const dummyInfo = await oldChef.poolInfo(oldChefPid);
  //   // console.log(dummyInfo);

  //   // const bswapRate = await oldChef.bswapPerSec();
  //   // console.log(formatUnits(bswapRate));

  //   // const allocPoints = dummyInfo.allocPoint;
  //   let balance = await bswapToken.balanceOf(masterChef.address);
  //   console.log(formatUnits(balance));

  //   await increase(ONE_DAY_SECONDS);

  //   await masterChef.harvest();
  //   balance = await bswapToken.balanceOf(masterChef.address);
  //   console.log(formatUnits(balance));
  // });

  // it('allows a position to claim rewards', async () => {
  //   const { nftPool, BaseXToken, xBSXToken, bswapToken, signer, tokenId } = await loadFixture(testFixture);

  //   let pending = await nftPool.pendingRewards(tokenId);
  //   let pMain = pending.mainAmount;
  //   let pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   await increase(ONE_DAY_SECONDS);

  //   pending = await nftPool.pendingRewards(tokenId);
  //   pMain = pending.mainAmount;
  //   pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   let userBswapBal = await bswapToken.balanceOf(signer.address);
  //   let userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   let userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));

  //   await nftPool.harvestPosition(tokenId);

  //   userBswapBal = await bswapToken.balanceOf(signer.address);
  //   userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));
  // });

  // it('allows a position to claim rewards when rates are zerod out', async () => {
  //   const { nftPool, BaseXToken, xBSXToken, bswapToken, signer, tokenId, masterChef } = await loadFixture(testFixture);

  //   console.log(`
  //   Pending:`);
  //   let pending = await nftPool.pendingRewards(tokenId);
  //   let pMain = pending.mainAmount;
  //   let pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   await increase(ONE_DAY_SECONDS);

  //   console.log(`
  //   Pending:`);
  //   pending = await nftPool.pendingRewards(tokenId);
  //   pMain = pending.mainAmount;
  //   pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   console.log(`
  //   Balances:`);
  //   let userBswapBal = await bswapToken.balanceOf(signer.address);
  //   let userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   let userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));

  //   await nftPool.harvestPosition(tokenId);

  //   console.log(`
  //   Balances:`);
  //   userBswapBal = await bswapToken.balanceOf(signer.address);
  //   userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));

  //   await BaseXToken.updateEmissionRate(parseUnits('0'));

  //   await increase(ONE_DAY_SECONDS);

  //   console.log(`
  //   Pending:`);
  //   pending = await nftPool.pendingRewards(tokenId);
  //   pMain = pending.mainAmount;
  //   pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   // Should give no token/xtoken without blowing up
  //   await nftPool.harvestPosition(tokenId);

  //   console.log(`
  //   Balances:`);
  //   userBswapBal = await bswapToken.balanceOf(signer.address);
  //   userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));

  //   await masterChef.setWethRewardRate(parseUnits('0'));

  //   await increase(ONE_DAY_SECONDS);

  //   console.log('WETH rate to zero now');

  //   console.log(`
  //   Pending:`);
  //   pending = await nftPool.pendingRewards(tokenId);
  //   pMain = pending.mainAmount;
  //   pSwap = pending.wethAmount;
  //   console.log(formatUnits(pMain));
  //   console.log(formatUnits(pSwap));

  //   console.log(`
  //   Balances:`);
  //   userBswapBal = await bswapToken.balanceOf(signer.address);
  //   userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));

  //   await nftPool.harvestPosition(tokenId);

  //   console.log(`
  //   Balances:`);
  //   userBswapBal = await bswapToken.balanceOf(signer.address);
  //   userBsxBal = await BaseXToken.balanceOf(signer.address);
  //   userXBsxBal = await xBSXToken.balanceOf(signer.address);
  //   console.log(formatUnits(userBswapBal));
  //   console.log(formatUnits(userBsxBal));
  //   console.log(formatUnits(userXBsxBal));
  // });

  it('rewards all regulat token', async () => {
    const { nftPool, BaseXToken, xBSXToken, bswapToken, signer, tokenId } = await loadFixture(testFixture);

    console.log(`
    Pending:`);
    let pending = await nftPool.pendingRewards(tokenId);
    let pMain = pending.mainAmount;
    let pSwap = pending.wethAmount;
    console.log(formatUnits(pMain));
    console.log(formatUnits(pSwap));

    await increase(ONE_DAY_SECONDS);

    console.log(`
    Pending:`);
    pending = await nftPool.pendingRewards(tokenId);
    pMain = pending.mainAmount;
    pSwap = pending.wethAmount;
    console.log(formatUnits(pMain));
    console.log(formatUnits(pSwap));

    console.log(`
    Balances:`);
    let userBswapBal = await bswapToken.balanceOf(signer.address);
    let userBsxBal = await BaseXToken.balanceOf(signer.address);
    let userXBsxBal = await xBSXToken.balanceOf(signer.address);
    console.log(formatUnits(userBswapBal));
    console.log(formatUnits(userBsxBal));
    console.log(formatUnits(userXBsxBal));

    await nftPool.harvestPosition(tokenId);

    // User claim, set all to regular token, pending only shows total, but next claim should increase only regular token balance

    console.log(`
    Balances:`);
    userBswapBal = await bswapToken.balanceOf(signer.address);
    userBsxBal = await BaseXToken.balanceOf(signer.address);
    userXBsxBal = await xBSXToken.balanceOf(signer.address);
    console.log(formatUnits(userBswapBal));
    console.log(formatUnits(userBsxBal));
    console.log(formatUnits(userXBsxBal));

    await nftPool.setXTokenRewardsShare(0);

    await increase(ONE_DAY_SECONDS);

    console.log(`
    Pending:`);
    pending = await nftPool.pendingRewards(tokenId);
    pMain = pending.mainAmount;
    pSwap = pending.wethAmount;
    console.log(formatUnits(pMain));
    console.log(formatUnits(pSwap));

    console.log(`
    Balances:`);
    userBswapBal = await bswapToken.balanceOf(signer.address);
    userBsxBal = await BaseXToken.balanceOf(signer.address);
    userXBsxBal = await xBSXToken.balanceOf(signer.address);
    console.log(formatUnits(userBswapBal));
    console.log(formatUnits(userBsxBal));
    console.log(formatUnits(userXBsxBal));

    await nftPool.harvestPosition(tokenId);

    console.log(`
    Balances:`);
    userBswapBal = await bswapToken.balanceOf(signer.address);
    userBsxBal = await BaseXToken.balanceOf(signer.address);
    userXBsxBal = await xBSXToken.balanceOf(signer.address);
    console.log(formatUnits(userBswapBal));
    console.log(formatUnits(userBsxBal));
    console.log(formatUnits(userXBsxBal));
  });
});
