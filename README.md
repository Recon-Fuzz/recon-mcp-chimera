# @recon-fuzz/mcp-chimera

MCP server that scaffolds [Chimera](https://getrecon.xyz/learn/chimera-framework) fuzzing test suites for Solidity smart contracts. Generates ready-to-compile projects with properties, handlers, and fuzzer configs.

> **Ready to publish?** See [MCP_ACTIVATION.md](MCP_ACTIVATION.md) for the full guide — npm publish, directory listings, llms.txt integration, and Claude Desktop/Cursor setup.

## Tools

| Tool | Input | Returns |
|------|-------|---------|
| `scaffold_project` | `contract_name`, `functions[]` | Full Chimera project (Setup, Properties, TargetFunctions, BeforeAfter, CryticTester + configs) |
| `generate_properties` | `contract_source`, `protocol_type` | 8-15 curated invariant properties with Solidity skeletons |
| `get_template` | `template_name` | Complete ready-to-compile Chimera project for a standard protocol type |
| `explain_pattern` | `pattern_name` | Detailed explanation with code examples |

### Protocol types

`erc20`, `vault`, `lending`, `amm`, `governance`, `staking`

### Patterns

`actors`, `ghosts`, `cross-contract`, `setup-layering`

## Setup for Claude Desktop / Cursor

```json
{
  "mcpServers": {
    "chimera-scaffold": {
      "command": "npx",
      "args": ["@recon-fuzz/mcp-chimera"]
    }
  }
}
```

No API key needed. The server runs entirely locally with no network calls.

## Local development

```bash
git clone https://github.com/Recon-Fuzz/recon-mcp-chimera.git
cd recon-mcp-chimera
npm install
npm run build
```

### Test it works

```bash
# List tools
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node dist/index.js

# Scaffold a vault project
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"scaffold_project","arguments":{"contract_name":"SimpleVault","functions":["deposit(uint256)","withdraw(uint256)"]}},"id":2}' | node dist/index.js

# Get a lending template
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_template","arguments":{"template_name":"lending"}},"id":3}' | node dist/index.js
```

## Validation steps

Before making this repo public or publishing to npm, verify the following:

### 1. Functional checks

- [ ] `npm run build` compiles with zero errors
- [ ] `tools/list` returns 4 tools
- [ ] `scaffold_project` with `SimpleVault` + `["deposit(uint256)", "withdraw(uint256)"]` returns 8 files
- [ ] Generated Setup.sol, Properties.sol, TargetFunctions.sol, BeforeAfter.sol, CryticTester.sol are valid Solidity (paste into Remix or run `forge build` in a test project)
- [ ] `generate_properties` returns properties for each of the 6 protocol types
- [ ] `get_template` returns complete projects for all 6 protocol types
- [ ] `explain_pattern` returns explanations for all 4 patterns
- [ ] Generated echidna.yaml and medusa.json are valid configs

### 2. Security checks

- [ ] `@modelcontextprotocol/sdk` is pinned to `^1.29.0` (not `"latest"`)
- [ ] `contract_name` is validated as a strict Solidity identifier (`/^[a-zA-Z_][a-zA-Z0-9_]*$/`) — try injecting `"Evil {} contract Hack {"`
- [ ] Function signatures are validated — try injecting `"deposit(uint256); selfdestruct(msg.sender); //"`
- [ ] Parameter types are validated against Solidity identifier pattern
- [ ] Unicode control characters are stripped from all inputs (Trojan Source prevention)
- [ ] Prototype pollution is blocked — try `protocol_type: "__proto__"` and `pattern_name: "constructor"`
- [ ] Input length limits enforced: contract_name max 256, functions max 200 items, signatures max 512 chars
- [ ] No network calls, no env vars read, no filesystem writes, no telemetry

### 3. Code quality of generated Solidity

- [ ] Inheritance chain is correct: Setup -> BeforeAfter -> Properties -> TargetFunctions -> CryticTester
- [ ] CryticTester inherits TargetFunctions + CryticAsserts (not Properties separately — that's already in the chain)
- [ ] Handler functions use `bound()` for input clamping (not `clampBetween`)
- [ ] Properties use `invariant_` prefix
- [ ] BeforeAfter hooks use `__before()` and `__after()`
- [ ] Generated foundry.toml remappings include `@chimera/=lib/chimera/src/`
- [ ] All generated .sol files have SPDX license identifier and pragma

### 4. Pre-publish checks

- [ ] Add `"files": ["dist"]` to package.json
- [ ] Set `"sourceMap": false` in tsconfig.json for production
- [ ] Run `npm audit` — should report 0 vulnerabilities
- [ ] Test with Claude Desktop or Cursor — ask it to "scaffold a Chimera test suite for an ERC20 token" and verify the output compiles

## Architecture

- No network calls — everything is in-memory templates and string generation
- `src/templates/base.ts` — Solidity file generators (Setup, BeforeAfter, Properties, TargetFunctions, CryticTester)
- `src/templates/configs.ts` — Fuzzer config generators (foundry.toml, echidna.yaml, medusa.json)
- `src/properties/` — Curated property catalogs per protocol type (8-15 properties each)
- `src/patterns/` — Pattern explanations with full Solidity code examples
- `src/tools/` — MCP tool implementations

## Privacy

This server runs entirely offline. No network calls, no environment variables read, no data written to disk, no telemetry. All template generation happens in-process.
