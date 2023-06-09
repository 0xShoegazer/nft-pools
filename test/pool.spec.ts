import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { awesomeFixture } from './fixtures/awesome.fixture';
import { formatEther } from 'ethers/lib/utils';

describe('NFT Pools', () => {
  beforeEach(async () => {});

  it('Should', async () => {
    const { nftPool } = await loadFixture(awesomeFixture);
    expect(true).to.be.true;
  });
});
