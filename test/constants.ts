import { parseEther } from '@ethersproject/units';
import { ethers } from 'hardhat';
import { keccak256, toBytes32 } from './utils';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

export const ZERO_ADDRESS = ethers.constants.AddressZero;
export const MAX_UINT256 = ethers.constants.MaxUint256;
export const TEN_POW_18_BN = BigNumber.from(10).pow(18);
export const ONE_SECOND_MS = 1000;
export const ONE_E_18_BN = parseUnits('1000000000000000000');

export const ONE_DAY_SECONDS = 86400;

export const ZERO_BYTES_32 = toBytes32(parseEther('0'));

// Contract storage slots for user balances
// Use to overwrite a users balance to any value for testing
// Removes need for a whole dex and swap setup just for test tokens
export const BUSD_BALANCEOF_SLOT = 1;
export const USDC_BALANCEOF_SLOT = 1;
export const USDC_ARBITRUM_BALANCE_SLOT = 51;
export const WBNB_BALANCEOF_SLOT = 3;

export const UNIV2_POOL_BALANCEOF_SLOT = 1;
export const BAL_POOL_BALANCEOFSLOT = 0; // WeightedPool instance slot

// Used in most of the contracts for AccessContol
export const ADMIN_ROLE_HASH = keccak256(['string'], ['ADMIN_ROLE']);

export const USDC_ARBITRUM_WHALE = '0x62383739d68dd0f844103db8dfb05a7eded5bbe6';
