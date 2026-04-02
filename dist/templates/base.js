// Template generators for Chimera fuzzing suites
export function parseSignature(sig) {
    const match = sig.match(/^(\w+)\(([^)]*)\)$/);
    if (!match) {
        return { name: sig, params: [], raw: sig };
    }
    const name = match[1];
    const paramStr = match[2].trim();
    const params = paramStr.length === 0
        ? []
        : paramStr.split(",").map((p, i) => {
            const trimmed = p.trim();
            const parts = trimmed.split(/\s+/);
            return {
                type: parts[0],
                name: parts.length > 1 ? parts[1] : `arg${i}`,
            };
        });
    return { name, params, raw: sig };
}
export function generateSetup(contractName) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseSetup} from "@chimera/BaseSetup.sol";
import {${contractName}} from "../src/${contractName}.sol";

abstract contract Setup is BaseSetup {
    ${contractName} internal target;

    function setup() internal virtual override {
        target = new ${contractName}();
    }
}
`;
}
export function generateBeforeAfter(contractName) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Setup} from "./Setup.sol";

abstract contract BeforeAfter is Setup {
    struct Snapshot {
        uint256 totalSupply;
        uint256 actorBalance;
        uint256 contractBalance;
    }

    Snapshot internal _before;
    Snapshot internal _after;

    function _snapshotBefore() internal {
        _before.totalSupply = target.totalSupply();
        _before.actorBalance = address(msg.sender).balance;
        _before.contractBalance = address(target).balance;
    }

    function _snapshotAfter() internal {
        _after.totalSupply = target.totalSupply();
        _after.actorBalance = address(msg.sender).balance;
        _after.contractBalance = address(target).balance;
    }
}
`;
}
function clampExpression(paramType, paramName) {
    if (paramType.startsWith("uint")) {
        return `${paramName} = bound(${paramName}, 1, type(${paramType}).max);`;
    }
    if (paramType.startsWith("int")) {
        return `${paramName} = bound(${paramName}, type(${paramType}).min, type(${paramType}).max);`;
    }
    return `// no clamping for ${paramType} ${paramName}`;
}
export function generateTargetFunctions(contractName, functions) {
    const handlers = functions
        .map((fn) => {
        const paramDecls = fn.params
            .map((p) => `${p.type} ${p.name}`)
            .join(", ");
        const clamps = fn.params
            .map((p) => `        ${clampExpression(p.type, p.name)}`)
            .join("\n");
        const callArgs = fn.params.map((p) => p.name).join(", ");
        return `    function handler_${fn.name}(${paramDecls}) external {
${clamps}
        target.${fn.name}(${callArgs});
    }`;
    })
        .join("\n\n");
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BeforeAfter} from "./BeforeAfter.sol";

abstract contract TargetFunctions is BeforeAfter {
${handlers}
}
`;
}
export function generateProperties(_contractName) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BeforeAfter} from "./BeforeAfter.sol";

abstract contract Properties is BeforeAfter {
    /// @dev Solvency: contract balance must always cover total supply
    function invariant_solvency() public view returns (bool) {
        return address(target).balance >= target.totalSupply();
    }

    /// @dev No zero-share minting: total supply should not increase without deposits
    function invariant_no_free_shares() public view returns (bool) {
        return true; // Placeholder: implement based on protocol logic
    }
}
`;
}
export function generateCryticTester(contractName) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {TargetFunctions} from "./TargetFunctions.sol";
import {Properties} from "./Properties.sol";
import {CryticAsserts} from "@chimera/CryticAsserts.sol";

contract CryticTester is TargetFunctions, Properties, CryticAsserts {
    constructor() {
        setup();
    }
}
`;
}
//# sourceMappingURL=base.js.map