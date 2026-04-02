// Template generators for Chimera fuzzing suites

function sanitizeInput(input: string): string {
  // Strip Unicode control characters (categories Cc, Cf except common whitespace)
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]/g, '');
}

function validateContractName(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid contract name: "${name.slice(0, 100)}". Must be a valid Solidity identifier.`);
  }
  if (name.length > 256) {
    throw new Error(`Contract name too long (max 256 characters)`);
  }
  return name;
}

export interface ParsedFunction {
  name: string;
  params: { type: string; name: string }[];
  raw: string;
}

export function parseSignature(sig: string): ParsedFunction {
  sig = sanitizeInput(sig);
  const match = sig.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/);
  if (!match) {
    throw new Error(`Invalid function signature: "${sig.slice(0, 100)}". Expected format: functionName(type1,type2)`);
  }
  const name = match[1];
  const paramStr = match[2].trim();
  const params = paramStr.length === 0 ? [] : paramStr.split(",").map((p, i) => {
    const trimmed = p.trim();
    const parts = trimmed.split(/\s+/);
    const type = parts[0];
    const paramName = parts.length > 1 ? parts[1] : `arg${i}`;
    if (!/^[a-zA-Z_][a-zA-Z0-9_\[\]]*$/.test(type)) {
      throw new Error(`Invalid parameter type: "${type.slice(0, 50)}"`);
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(paramName)) {
      throw new Error(`Invalid parameter name: "${paramName.slice(0, 50)}"`);
    }
    return { type, name: paramName };
  });
  return { name, params, raw: sig };
}

export function generateSetup(contractName: string): string {
  contractName = validateContractName(sanitizeInput(contractName));
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

export function generateBeforeAfter(contractName: string): string {
  contractName = validateContractName(sanitizeInput(contractName));
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Setup} from "./Setup.sol";

abstract contract BeforeAfter is Setup {
    // Add protocol-specific state variables to snapshot here
    // Example for a token: uint256 totalSupply;
    // Example for a vault: uint256 sharePrice;
    uint256 internal _beforeContractBalance;
    uint256 internal _afterContractBalance;

    function __before() internal {
        _beforeContractBalance = address(target).balance;
        // Add protocol-specific snapshots here
        // Example: _beforeTotalSupply = target.totalSupply();
    }

    function __after() internal {
        _afterContractBalance = address(target).balance;
        // Add protocol-specific snapshots here
        // Example: _afterTotalSupply = target.totalSupply();
    }
}
`;
}

function clampExpression(paramType: string, paramName: string): string {
  if (paramType.startsWith("uint")) {
    return `${paramName} = bound(${paramName}, 1, type(${paramType}).max);`;
  }
  if (paramType.startsWith("int")) {
    return `${paramName} = bound(${paramName}, type(${paramType}).min, type(${paramType}).max);`;
  }
  return `// no clamping for ${paramType} ${paramName}`;
}

export function generateTargetFunctions(
  contractName: string,
  functions: ParsedFunction[]
): string {
  contractName = validateContractName(sanitizeInput(contractName));
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

export function generateProperties(_contractName: string): string {
  validateContractName(sanitizeInput(_contractName));
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BeforeAfter} from "./BeforeAfter.sol";

abstract contract Properties is BeforeAfter {
    /// @dev Solvency: contract balance should not decrease unexpectedly
    function invariant_solvency() public view returns (bool) {
        // Replace with protocol-specific solvency check
        // Example for a vault: token.balanceOf(address(target)) >= target.totalAssets()
        return address(target).balance >= 0;
    }

    /// @dev Balance consistency: placeholder for protocol-specific invariant
    function invariant_balance_consistency() public view returns (bool) {
        return true; // Implement based on protocol logic
    }
}
`;
}

export function generateCryticTester(contractName: string): string {
  contractName = validateContractName(sanitizeInput(contractName));
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {TargetFunctions} from "./TargetFunctions.sol";
import {CryticAsserts} from "@chimera/CryticAsserts.sol";

contract CryticTester is TargetFunctions, CryticAsserts {
    constructor() {
        setup();
    }
}
`;
}
