export type PatternName = "actors" | "ghosts" | "cross-contract" | "setup-layering";
export interface ExplainPatternInput {
    pattern_name: string;
}
export interface PatternExplanation {
    name: string;
    title: string;
    description: string;
    explanation: string;
    codeExample: string;
}
export declare function explainPattern(input: ExplainPatternInput): PatternExplanation;
//# sourceMappingURL=explain-pattern.d.ts.map