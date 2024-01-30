import { impersonateAccount, loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { increase, latest } from '@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time';
import { expect } from 'chai';
import { MAX_UINT256, ONE_DAY_SECONDS, UNIV2_POOL_BALANCEOF_SLOT } from './constants';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import { giveTokenBalanceFor } from './utils';
import { getERC20WithSigner } from '../scripts/utils';

const ETH_BSWAP_LP = '0xE80B4F755417FB4baF4dbd23C029db3F62786523';
const ETH_BSWAP_NFT_POOL = '0xaA93C2eFD8fcC07c723E19A6e78eF5d2644BF391';
const CHEF = '0xaBEb4DeD0b07460F9C9edb85864DFd3a6865D570';
const BSX = '0xd5046B976188EB40f6DE40fB527F89c05b323385';
const xBSX = '0xE4750593d1fC8E74b31549212899A72162f315Fa';
const BSWAP = '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9';
const TREASURY = '0xAF1823bACd8EDDA3b815180a61F8741fA4aBc6Dd';
const YIELD_BOOST = '0x0F5433c9f1c2E86588304eD09BC79AbEcc89e0de';

const testFixture = async () => {
  await impersonateAccount(TREASURY);
  const owner = await ethers.getSigner(TREASURY);
  const [signer, user] = await ethers.getSigners();

  const userOneLpBalance = parseUnits('100');
  // Setup account funds
  await giveTokenBalanceFor(ethers.provider, ETH_BSWAP_LP, user.address, UNIV2_POOL_BALANCEOF_SLOT, userOneLpBalance);

  const nftPool = await ethers.getContractAt('NFTPool', ETH_BSWAP_NFT_POOL, user);
  const lpInstance = await getERC20WithSigner(ETH_BSWAP_LP, user);
  await lpInstance.approve(nftPool.address, MAX_UINT256);
  const tx = await nftPool.createPosition(userOneLpBalance.div(2), 0);
  const rx = await tx.wait();
  const evt = rx.events.find((e) => e.event === 'CreatePosition');

  const yieldBooster = await ethers.getContractAt('YieldBooster', YIELD_BOOST, user);
  const xToken = await ethers.getContractAt('xSwapMode', xBSX, user);

  return {
    owner,
    user,
    nftPool,
    tokenId: parseInt(evt.args.tokenId),

    xToken,
    yieldBooster,
  };
};

describe('NFTPool Fork', () => {
  it('gives weth rewards with yield boost', async () => {
    const { owner, user, tokenId, nftPool, yieldBooster, xToken } = await loadFixture(testFixture);

    await time.increase(ONE_DAY_SECONDS);

    // TODO: Yield boost allocation, move time, check what happens when allocate/deallocate with the weth rewards
    // Think its something with the "reserves"

    let pending = await nftPool.pendingRewards(tokenId);

    const mainAmount = formatUnits(pending.mainAmount);
    const wethAmount = formatUnits(pending.wethAmount); // BSWAP

    console.log('mainAmount', mainAmount);
    console.log('wethAmount', wethAmount);

    await xToken.approveUsage(yieldBooster.address, MAX_UINT256);
  });
});
