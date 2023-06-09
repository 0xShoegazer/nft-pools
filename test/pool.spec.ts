import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { formatEther } from 'ethers/lib/utils';

describe('NFT Pools', () => {
  beforeEach(async () => {});

  it('Should', async () => {
    const { chefRamsey } = await loadFixture(awesomeFixture);
    console.log(formatEther(await chefRamsey.emissionRate()));
    expect(true).to.be.true;
  });
});
