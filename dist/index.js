#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { scaffoldProject } from "./tools/scaffold-project.js";
import { generateProperties } from "./tools/generate-properties.js";
import { getTemplate } from "./tools/get-template.js";
import { explainPattern } from "./tools/explain-pattern.js";
const server = new McpServer({
    name: "recon-mcp-chimera",
    version: "1.0.0",
});
// Tool: scaffold_project
server.tool("scaffold_project", "Scaffold a complete Chimera fuzzing test suite for a given contract and its functions. Returns an array of {path, content} for all project files.", {
    contract_name: z
        .string()
        .describe("Name of the contract to scaffold tests for"),
    functions: z
        .array(z.string())
        .describe('Array of function signatures, e.g. ["deposit(uint256)", "withdraw(uint256)"]'),
}, async ({ contract_name, functions }) => {
    try {
        const files = scaffoldProject({ contract_name, functions });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(files, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Tool: generate_properties
server.tool("generate_properties", "Generate 8-15 curated invariant properties with Solidity skeletons based on the protocol type and contract source.", {
    contract_source: z
        .string()
        .describe("Solidity source code of the contract"),
    protocol_type: z
        .string()
        .describe("Protocol type: erc20, vault, lending, amm, governance, or staking"),
}, async ({ contract_source, protocol_type }) => {
    try {
        const properties = generateProperties({
            contract_source,
            protocol_type,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(properties, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Tool: get_template
server.tool("get_template", "Get a complete ready-to-compile Chimera project template for a standard protocol type.", {
    template_name: z
        .string()
        .describe("Template name: erc20, vault, lending, amm, governance, or staking"),
}, async ({ template_name }) => {
    try {
        const files = getTemplate({ template_name });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(files, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Tool: explain_pattern
server.tool("explain_pattern", "Get a detailed explanation of a Chimera fuzzing pattern with code examples.", {
    pattern_name: z
        .string()
        .describe("Pattern name: actors, ghosts, cross-contract, or setup-layering"),
}, async ({ pattern_name }) => {
    try {
        const explanation = explainPattern({ pattern_name });
        const formatted = `# ${explanation.title}

${explanation.description}

${explanation.explanation}

## Code Example

\`\`\`solidity
${explanation.codeExample}
\`\`\``;
        return {
            content: [{ type: "text", text: formatted }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map