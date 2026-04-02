export const crossContractPattern = {
    name: "cross-contract",
    title: "Cross-Contract Interaction Pattern",
    description: `The cross-contract pattern tests interactions between multiple contracts in a protocol,
catching integration bugs that single-contract fuzzing misses.`,
    explanation: `
## Why Cross-Contract Testing

Most DeFi exploits involve interactions BETWEEN contracts, not bugs within a single one:
- Oracle manipulation affecting lending decisions
- Token approval/transfer chains across routers
- Flash loan callbacks that re-enter other protocol components
- Governance executing actions on treasury/staking contracts

## Architecture

1. **Deploy all relevant contracts** in Setup
2. **Wire them together** (set oracle address, register tokens, etc.)
3. **Target functions span multiple contracts** (swap then borrow, deposit then leverage)
4. **Properties check cross-contract invariants** (total value locked across all vaults)

## Common Cross-Contract Properties
- Value conservation across all contracts
- No unauthorized cross-contract calls
- Oracle state consistency with actual prices
- Proper access control across contract boundaries
`,
    codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseSetup} from "@chimera/BaseSetup.sol";

abstract contract CrossContractSetup is BaseSetup {
    LendingPool internal pool;
    PriceOracle internal oracle;
    TokenA internal tokenA;
    TokenB internal tokenB;
    LiquidationEngine internal liquidator;

    function setup() internal virtual override {
        // Deploy all protocol contracts
        tokenA = new TokenA();
        tokenB = new TokenB();
        oracle = new PriceOracle();
        pool = new LendingPool(address(oracle));
        liquidator = new LiquidationEngine(address(pool));

        // Wire contracts together
        pool.setLiquidationEngine(address(liquidator));
        pool.addMarket(address(tokenA), 75e16); // 75% LTV
        pool.addMarket(address(tokenB), 80e16); // 80% LTV

        // Set initial oracle prices
        oracle.setPrice(address(tokenA), 1000e18);
        oracle.setPrice(address(tokenB), 1e18);

        // Fund actors
        tokenA.mint(address(this), 1_000_000e18);
        tokenB.mint(address(this), 1_000_000e18);
    }
}

abstract contract CrossContractTargets is CrossContractSetup {
    /// @dev Deposit collateral then borrow in one sequence
    function handler_deposit_and_borrow(
        uint256 depositAmount,
        uint256 borrowAmount
    ) external {
        depositAmount = bound(depositAmount, 1e18, 100_000e18);
        borrowAmount = bound(borrowAmount, 1, depositAmount * 75 / 100);

        tokenA.approve(address(pool), depositAmount);
        pool.deposit(address(tokenA), depositAmount);
        pool.borrow(address(tokenB), borrowAmount);
    }

    /// @dev Manipulate oracle price then attempt liquidation
    function handler_price_change_and_liquidate(
        uint256 newPrice,
        address targetUser
    ) external {
        newPrice = bound(newPrice, 1e16, 100_000e18);
        oracle.setPrice(address(tokenA), newPrice);
        liquidator.liquidate(targetUser, address(tokenA));
    }
}

abstract contract CrossContractProperties is CrossContractSetup {
    /// @dev Total value across all contracts must be conserved
    function invariant_total_value_conservation() public view returns (bool) {
        uint256 poolValue = pool.totalValueLocked();
        uint256 tokenASupply = tokenA.totalSupply();
        uint256 tokenBSupply = tokenB.totalSupply();
        // Value in + value out = constant
        return poolValue <= tokenASupply * oracle.getPrice(address(tokenA)) / 1e18
            + tokenBSupply * oracle.getPrice(address(tokenB)) / 1e18;
    }
}`,
};
//# sourceMappingURL=cross-contract.js.map