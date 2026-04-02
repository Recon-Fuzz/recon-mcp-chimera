import type { FileOutput } from "./scaffold-project.js";
export type TemplateName = "erc20" | "vault" | "lending" | "amm" | "governance" | "staking";
export interface GetTemplateInput {
    template_name: string;
}
export declare function getTemplate(input: GetTemplateInput): FileOutput[];
//# sourceMappingURL=get-template.d.ts.map