# @recon-fuzz-mcp/chimera

[![npm](https://img.shields.io/npm/v/@recon-fuzz-mcp/chimera.svg)](https://www.npmjs.com/package/@recon-fuzz-mcp/chimera)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

MCP server that scaffolds [Chimera](https://getrecon.xyz/learn/chimera-framework) fuzzing test suites for Solidity smart contracts. Generates ready-to-compile projects with properties, handlers, and fuzzer configs.

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

## Installation

### Claude Code

```bash
claude mcp add chimera-scaffold -- npx @recon-fuzz-mcp/chimera
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "chimera-scaffold": {
      "command": "npx",
      "args": ["@recon-fuzz-mcp/chimera"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "chimera-scaffold": {
      "command": "npx",
      "args": ["@recon-fuzz-mcp/chimera"]
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

## Architecture

- No network calls — everything is in-memory templates and string generation
- `src/templates/base.ts` — Solidity file generators (Setup, BeforeAfter, Properties, TargetFunctions, CryticTester)
- `src/templates/configs.ts` — Fuzzer config generators (foundry.toml, echidna.yaml, medusa.json)
- `src/properties/` — Curated property catalogs per protocol type (8-15 properties each)
- `src/patterns/` — Pattern explanations with full Solidity code examples
- `src/tools/` — MCP tool implementations

## Privacy

This server runs entirely offline. No network calls, no environment variables read, no data written to disk, no telemetry. All template generation happens in-process.
