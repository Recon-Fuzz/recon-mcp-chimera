export const setupLayeringPattern = {
    name: "setup-layering",
    title: "Setup Layering Pattern",
    description: `Setup Layering structures your Chimera test suite into composable, inheritable layers,
each adding a specific concern. This keeps the codebase modular and lets you mix layers for different testing scenarios.`,
    explanation: `
## Why Layer Your Setup

A monolithic setup file becomes unmaintainable as the test suite grows. Layering separates concerns:
- **Base Setup**: Deploy contracts, set initial state
- **Actor Setup**: Create and configure test actors
- **Ghost Setup**: Initialize ghost tracking variables
- **BeforeAfter**: Snapshot hooks for state comparison
- **Target Functions**: Handler functions that call the protocol
- **Properties**: Invariant checks

## Inheritance Chain

\`\`\`
BaseSetup (Chimera)
  -> Setup (deploy + wire contracts)
    -> ActorSetup (create actors + roles)
      -> GhostSetup (ghost variable initialization)
        -> BeforeAfter (state snapshot hooks)
          -> TargetFunctions (handler_ functions)
            -> Properties (invariant_ checks)
              -> CryticTester (final entry point)
\`\`\`

## Benefits

1. **Composability**: Swap out layers (different actor sets for different scenarios)
2. **Readability**: Each file has a single responsibility
3. **Reusability**: Share Setup layers across multiple test configurations
4. **Debugging**: Isolate issues to a specific layer
`,
    codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Layer 1: Base deployment
import {BaseSetup} from "@chimera/BaseSetup.sol";

abstract contract Setup is BaseSetup {
    MyProtocol internal target;

    function setup() internal virtual override {
        target = new MyProtocol();
        target.initialize(1000e18);
    }
}

// Layer 2: Actor management
abstract contract ActorSetup is Setup {
    address[] internal actors;

    function setup() internal virtual override {
        super.setup();
        actors.push(address(0x20000));
        actors.push(address(0x30000));
        actors.push(address(0x40000));
    }
}

// Layer 3: Ghost variables
abstract contract GhostSetup is ActorSetup {
    uint256 internal ghost_totalDeposits;
    mapping(address => uint256) internal ghost_deposits;

    function setup() internal virtual override {
        super.setup();
        ghost_totalDeposits = 0;
    }
}

// Layer 4: Before/After snapshots
abstract contract BeforeAfter is GhostSetup {
    struct Vars {
        uint256 totalSupply;
        uint256 totalAssets;
    }

    Vars internal _before;
    Vars internal _after;

    function __before() internal {
        _before.totalSupply = target.totalSupply();
        _before.totalAssets = target.totalAssets();
    }

    function __after() internal {
        _after.totalSupply = target.totalSupply();
        _after.totalAssets = target.totalAssets();
    }
}

// Layer 5: Target Functions
abstract contract TargetFunctions is BeforeAfter {
    function handler_deposit(uint256 amount) external {
        amount = bound(amount, 1, type(uint128).max);
        __before();
        target.deposit(amount);
        ghost_totalDeposits += amount;
        __after();
    }
}

// Layer 6: Properties
abstract contract Properties is BeforeAfter {
    function invariant_solvency() public view returns (bool) {
        return target.totalAssets() >= ghost_totalDeposits;
    }
}

// Layer 7: Entry point
import {CryticAsserts} from "@chimera/CryticAsserts.sol";

contract CryticTester is TargetFunctions, Properties, CryticAsserts {
    constructor() {
        setup();
    }
}`,
};
//# sourceMappingURL=setup-layering.js.map