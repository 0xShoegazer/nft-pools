import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { awesomeFixture } from './fixtures/awesome.fixture';

describe('ChefRamsey', () => {
  beforeEach(async () => {});

  it('Should', async () => {
    const { chefRamsey } = await loadFixture(awesomeFixture);
    expect(true).to.be.true;
  });
});
