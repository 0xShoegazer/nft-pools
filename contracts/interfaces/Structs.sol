// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "./tokens/IERC20Metadata.sol";

struct RewardToken {
    IERC20Metadata token;
    uint256 sharesPerSecond;
    uint256 startTime;
    uint256 endTime;
    uint256 accTokenPerShare;
    uint256 PRECISION_FACTOR; // Account for varying decimals in calculations
}
