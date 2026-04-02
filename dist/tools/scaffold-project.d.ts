export interface ScaffoldInput {
    contract_name: string;
    functions: string[];
}
export interface FileOutput {
    path: string;
    content: string;
}
export declare function scaffoldProject(input: ScaffoldInput): FileOutput[];
//# sourceMappingURL=scaffold-project.d.ts.map