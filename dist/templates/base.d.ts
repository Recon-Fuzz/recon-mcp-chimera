export interface ParsedFunction {
    name: string;
    params: {
        type: string;
        name: string;
    }[];
    raw: string;
}
export declare function parseSignature(sig: string): ParsedFunction;
export declare function generateSetup(contractName: string): string;
export declare function generateBeforeAfter(contractName: string): string;
export declare function generateTargetFunctions(contractName: string, functions: ParsedFunction[]): string;
export declare function generateProperties(_contractName: string): string;
export declare function generateCryticTester(contractName: string): string;
//# sourceMappingURL=base.d.ts.map