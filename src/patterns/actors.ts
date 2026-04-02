export const actorsPattern = {
  name: "actors",
  title: "Actor Management Pattern",
  description: `The Actors pattern manages distinct user identities during fuzzing to test access control,
multi-user interactions, and privilege separation. Each actor represents a different EOA or contract
that interacts with the system under test.`,
  explanation: `
## Why Actors Matter

Fuzzing with a single caller misses entire bug classes:
- Access control violations (admin vs user)
- Cross-user state interference
- Multi-party protocol interactions (borrower + liquidator, buyer + seller)

## How Chimera Implements Actors

Chimera's BaseSetup provides an \`actors\` array and an \`_selectActor()\` modifier that
picks a random actor for each call. Target functions use \`prank(currentActor)\` to impersonate.

## Key Components

1. **Actor Array**: A fixed set of addresses representing different users
2. **Actor Selection**: Random selection per call to vary the caller
3. **Actor Roles**: Some actors get special roles (admin, operator, etc.)
4. **Actor Tracking**: Ghost variables track per-actor state for properties
`,
  codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseSetup} from "@chimera/BaseSetup.sol";

abstract contract ActorSetup is BaseSetup {
    address[] internal actors;
    address internal currentActor;

    address internal admin;
    address internal user1;
    address internal user2;
    address internal attacker;

    function setup() internal virtual override {
        admin = address(0x10000);
        user1 = address(0x20000);
        user2 = address(0x30000);
        attacker = address(0x40000);

        actors.push(admin);
        actors.push(user1);
        actors.push(user2);
        actors.push(attacker);

        // Grant admin role
        vm.prank(address(this));
        target.grantRole(target.ADMIN_ROLE(), admin);
    }

    /// @dev Select a random actor for the next call
    modifier useActor(uint256 actorSeed) {
        currentActor = actors[actorSeed % actors.length];
        vm.startPrank(currentActor);
        _;
        vm.stopPrank();
    }
}

// Usage in TargetFunctions:
abstract contract TargetFunctions is ActorSetup {
    function handler_deposit(uint256 actorSeed, uint256 amount) external useActor(actorSeed) {
        amount = bound(amount, 1, type(uint128).max);
        target.deposit(amount);
    }

    function handler_adminPause(uint256 actorSeed) external useActor(actorSeed) {
        // This will test that non-admin actors can't pause
        target.pause();
    }
}`,
};
