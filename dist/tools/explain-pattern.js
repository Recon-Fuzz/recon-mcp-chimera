import { actorsPattern } from "../patterns/actors.js";
import { ghostsPattern } from "../patterns/ghosts.js";
import { crossContractPattern } from "../patterns/cross-contract.js";
import { setupLayeringPattern } from "../patterns/setup-layering.js";
const patterns = {
    actors: actorsPattern,
    ghosts: ghostsPattern,
    "cross-contract": crossContractPattern,
    "setup-layering": setupLayeringPattern,
};
export function explainPattern(input) {
    const patternName = input.pattern_name.toLowerCase();
    const pattern = patterns[patternName];
    if (!pattern) {
        const validNames = Object.keys(patterns).join(", ");
        throw new Error(`Unknown pattern: "${input.pattern_name}". Valid patterns: ${validNames}`);
    }
    return {
        name: pattern.name,
        title: pattern.title,
        description: pattern.description,
        explanation: pattern.explanation,
        codeExample: pattern.codeExample,
    };
}
//# sourceMappingURL=explain-pattern.js.map