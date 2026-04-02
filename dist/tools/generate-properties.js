import { erc20Properties } from "../properties/erc20.js";
import { vaultProperties } from "../properties/vault.js";
import { lendingProperties } from "../properties/lending.js";
import { ammProperties } from "../properties/amm.js";
import { governanceProperties } from "../properties/governance.js";
import { stakingProperties } from "../properties/staking.js";
const propertyCatalogs = {
    erc20: erc20Properties,
    vault: vaultProperties,
    lending: lendingProperties,
    amm: ammProperties,
    governance: governanceProperties,
    staking: stakingProperties,
};
function detectRelevantProperties(source, properties) {
    // Return 8-15 curated properties based on protocol type
    // Prioritize by severity, then try to match function names in source
    const critical = properties.filter((p) => p.severity === "critical");
    const high = properties.filter((p) => p.severity === "high");
    const medium = properties.filter((p) => p.severity === "medium");
    const low = properties.filter((p) => p.severity === "low");
    const selected = [];
    // Always include all critical properties
    selected.push(...critical);
    // Add high severity up to a reasonable count
    for (const prop of high) {
        if (selected.length >= 12)
            break;
        selected.push(prop);
    }
    // Add medium/low to reach at least 8
    for (const prop of [...medium, ...low]) {
        if (selected.length >= 10)
            break;
        selected.push(prop);
    }
    // Cap at 15
    return selected.slice(0, 15);
}
export function generateProperties(input) {
    const protocolType = input.protocol_type.toLowerCase();
    const catalog = propertyCatalogs[protocolType];
    if (!catalog) {
        const validTypes = Object.keys(propertyCatalogs).join(", ");
        throw new Error(`Unknown protocol type: "${input.protocol_type}". Valid types: ${validTypes}`);
    }
    const selected = detectRelevantProperties(input.contract_source, catalog);
    return selected.map((prop) => ({
        name: prop.name,
        description: prop.description,
        severity: prop.severity,
        skeleton: prop.skeleton,
    }));
}
//# sourceMappingURL=generate-properties.js.map