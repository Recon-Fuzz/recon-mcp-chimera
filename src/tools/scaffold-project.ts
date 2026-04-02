import {
  parseSignature,
  generateSetup,
  generateBeforeAfter,
  generateTargetFunctions,
  generateProperties,
  generateCryticTester,
} from "../templates/base.js";
import {
  generateFoundryToml,
  generateEchidnaYaml,
  generateMedusaJson,
} from "../templates/configs.js";

export interface ScaffoldInput {
  contract_name: string;
  functions: string[];
}

export interface FileOutput {
  path: string;
  content: string;
}

export function scaffoldProject(input: ScaffoldInput): FileOutput[] {
  const { contract_name, functions } = input;
  const parsed = functions.map(parseSignature);

  const files: FileOutput[] = [
    {
      path: `test/recon/Setup.sol`,
      content: generateSetup(contract_name),
    },
    {
      path: `test/recon/BeforeAfter.sol`,
      content: generateBeforeAfter(contract_name),
    },
    {
      path: `test/recon/TargetFunctions.sol`,
      content: generateTargetFunctions(contract_name, parsed),
    },
    {
      path: `test/recon/Properties.sol`,
      content: generateProperties(contract_name),
    },
    {
      path: `test/recon/CryticTester.sol`,
      content: generateCryticTester(contract_name),
    },
    {
      path: `foundry.toml`,
      content: generateFoundryToml(),
    },
    {
      path: `echidna.yaml`,
      content: generateEchidnaYaml(contract_name),
    },
    {
      path: `medusa.json`,
      content: generateMedusaJson(contract_name),
    },
  ];

  return files;
}
