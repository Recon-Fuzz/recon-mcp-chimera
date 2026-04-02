import type { PropertyDef } from "../properties/erc20.js";
import { erc20Properties } from "../properties/erc20.js";
import { vaultProperties } from "../properties/vault.js";
import { lendingProperties } from "../properties/lending.js";
import { ammProperties } from "../properties/amm.js";
import { governanceProperties } from "../properties/governance.js";
import { stakingProperties } from "../properties/staking.js";

export type ProtocolType =
  | "erc20"
  | "vault"
  | "lending"
  | "amm"
  | "governance"
  | "staking";

const propertyCatalogs: Record<ProtocolType, PropertyDef[]> = {
  erc20: erc20Properties,
  vault: vaultProperties,
  lending: lendingProperties,
  amm: ammProperties,
  governance: governanceProperties,
  staking: stakingProperties,
};

export interface GeneratePropertiesInput {
  contract_source: string;
  protocol_type: string;
}

export interface PropertyOutput {
  name: string;
  description: string;
  severity: string;
  skeleton: string;
}

function detectRelevantProperties(
  source: string,
  properties: PropertyDef[]
): PropertyDef[] {
  const sourceLower = source.toLowerCase();

  // Score each property: severity base + source keyword match bonus
  const scored = properties.map((prop) => {
    let score = 0;
    // Base score by severity
    switch (prop.severity) {
      case "critical": score = 40; break;
      case "high": score = 30; break;
      case "medium": score = 20; break;
      case "low": score = 10; break;
    }
    // Bonus if the property name or keywords appear in the contract source
    if (source.length > 0) {
      const keywords = prop.name
        .replace(/invariant_/g, "")
        .split("_")
        .filter((w) => w.length > 3);
      for (const kw of keywords) {
        if (sourceLower.includes(kw)) {
          score += 5;
        }
      }
    }
    return { prop, score };
  });

  // Sort by score descending, return 8-15
  scored.sort((a, b) => b.score - a.score);
  const minCount = Math.min(8, scored.length);
  const maxCount = Math.min(15, scored.length);

  // Include at least 8, up to 15 if they scored above the low threshold
  const selected = scored.slice(0, minCount).map((s) => s.prop);
  for (let i = minCount; i < maxCount; i++) {
    if (scored[i].score >= 10) {
      selected.push(scored[i].prop);
    }
  }

  return selected;
}

export function generateProperties(
  input: GeneratePropertiesInput
): PropertyOutput[] {
  const protocolType = input.protocol_type.toLowerCase() as ProtocolType;

  if (!Object.hasOwn(propertyCatalogs, protocolType)) {
    const validTypes = Object.keys(propertyCatalogs).join(", ");
    throw new Error(
      `Unknown protocol type: "${input.protocol_type}". Valid types: ${validTypes}`
    );
  }

  const catalog = propertyCatalogs[protocolType];
  const selected = detectRelevantProperties(input.contract_source, catalog);

  return selected.map((prop) => ({
    name: prop.name,
    description: prop.description,
    severity: prop.severity,
    skeleton: prop.skeleton,
  }));
}
