export type ProtocolType = "erc20" | "vault" | "lending" | "amm" | "governance" | "staking";
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
export declare function generateProperties(input: GeneratePropertiesInput): PropertyOutput[];
//# sourceMappingURL=generate-properties.d.ts.map