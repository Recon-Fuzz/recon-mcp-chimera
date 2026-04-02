import { actorsPattern } from "../patterns/actors.js";
import { ghostsPattern } from "../patterns/ghosts.js";
import { crossContractPattern } from "../patterns/cross-contract.js";
import { setupLayeringPattern } from "../patterns/setup-layering.js";

export type PatternName =
  | "actors"
  | "ghosts"
  | "cross-contract"
  | "setup-layering";

const patterns: Record<
  PatternName,
  { name: string; title: string; description: string; explanation: string; codeExample: string }
> = {
  actors: actorsPattern,
  ghosts: ghostsPattern,
  "cross-contract": crossContractPattern,
  "setup-layering": setupLayeringPattern,
};

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

export function explainPattern(input: ExplainPatternInput): PatternExplanation {
  const patternName = input.pattern_name.toLowerCase() as PatternName;

  if (!Object.hasOwn(patterns, patternName)) {
    const validNames = Object.keys(patterns).join(", ");
    throw new Error(
      `Unknown pattern: "${input.pattern_name}". Valid patterns: ${validNames}`
    );
  }

  const pattern = patterns[patternName];
  return {
    name: pattern.name,
    title: pattern.title,
    description: pattern.description,
    explanation: pattern.explanation,
    codeExample: pattern.codeExample,
  };
}
