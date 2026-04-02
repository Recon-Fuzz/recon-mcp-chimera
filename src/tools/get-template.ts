import {
  generateSetup,
  generateBeforeAfter,
  generateTargetFunctions,
  generateProperties,
  generateCryticTester,
  type ParsedFunction,
} from "../templates/base.js";
import {
  generateFoundryToml,
  generateEchidnaYaml,
  generateMedusaJson,
} from "../templates/configs.js";
import type { FileOutput } from "./scaffold-project.js";

export type TemplateName =
  | "erc20"
  | "vault"
  | "lending"
  | "amm"
  | "governance"
  | "staking";

interface TemplateConfig {
  contractName: string;
  functions: ParsedFunction[];
}

const templateConfigs: Record<TemplateName, TemplateConfig> = {
  erc20: {
    contractName: "ERC20Token",
    functions: [
      {
        name: "transfer",
        params: [
          { type: "address", name: "to" },
          { type: "uint256", name: "amount" },
        ],
        raw: "transfer(address,uint256)",
      },
      {
        name: "approve",
        params: [
          { type: "address", name: "spender" },
          { type: "uint256", name: "amount" },
        ],
        raw: "approve(address,uint256)",
      },
      {
        name: "transferFrom",
        params: [
          { type: "address", name: "from" },
          { type: "address", name: "to" },
          { type: "uint256", name: "amount" },
        ],
        raw: "transferFrom(address,address,uint256)",
      },
      {
        name: "mint",
        params: [{ type: "uint256", name: "amount" }],
        raw: "mint(uint256)",
      },
      {
        name: "burn",
        params: [{ type: "uint256", name: "amount" }],
        raw: "burn(uint256)",
      },
    ],
  },
  vault: {
    contractName: "Vault",
    functions: [
      {
        name: "deposit",
        params: [
          { type: "uint256", name: "assets" },
          { type: "address", name: "receiver" },
        ],
        raw: "deposit(uint256,address)",
      },
      {
        name: "withdraw",
        params: [
          { type: "uint256", name: "assets" },
          { type: "address", name: "receiver" },
          { type: "address", name: "owner" },
        ],
        raw: "withdraw(uint256,address,address)",
      },
      {
        name: "redeem",
        params: [
          { type: "uint256", name: "shares" },
          { type: "address", name: "receiver" },
          { type: "address", name: "owner" },
        ],
        raw: "redeem(uint256,address,address)",
      },
      {
        name: "mint",
        params: [
          { type: "uint256", name: "shares" },
          { type: "address", name: "receiver" },
        ],
        raw: "mint(uint256,address)",
      },
    ],
  },
  lending: {
    contractName: "LendingPool",
    functions: [
      {
        name: "deposit",
        params: [
          { type: "address", name: "asset" },
          { type: "uint256", name: "amount" },
        ],
        raw: "deposit(address,uint256)",
      },
      {
        name: "borrow",
        params: [
          { type: "address", name: "asset" },
          { type: "uint256", name: "amount" },
        ],
        raw: "borrow(address,uint256)",
      },
      {
        name: "repay",
        params: [
          { type: "address", name: "asset" },
          { type: "uint256", name: "amount" },
        ],
        raw: "repay(address,uint256)",
      },
      {
        name: "liquidate",
        params: [
          { type: "address", name: "borrower" },
          { type: "address", name: "collateralAsset" },
          { type: "uint256", name: "debtToCover" },
        ],
        raw: "liquidate(address,address,uint256)",
      },
      {
        name: "withdraw",
        params: [
          { type: "address", name: "asset" },
          { type: "uint256", name: "amount" },
        ],
        raw: "withdraw(address,uint256)",
      },
    ],
  },
  amm: {
    contractName: "AMM",
    functions: [
      {
        name: "swap",
        params: [
          { type: "address", name: "tokenIn" },
          { type: "uint256", name: "amountIn" },
          { type: "uint256", name: "minAmountOut" },
        ],
        raw: "swap(address,uint256,uint256)",
      },
      {
        name: "addLiquidity",
        params: [
          { type: "uint256", name: "amount0" },
          { type: "uint256", name: "amount1" },
        ],
        raw: "addLiquidity(uint256,uint256)",
      },
      {
        name: "removeLiquidity",
        params: [{ type: "uint256", name: "lpAmount" }],
        raw: "removeLiquidity(uint256)",
      },
    ],
  },
  governance: {
    contractName: "Governor",
    functions: [
      {
        name: "propose",
        params: [
          { type: "address", name: "target" },
          { type: "uint256", name: "value" },
          { type: "bytes", name: "calldata_" },
        ],
        raw: "propose(address,uint256,bytes)",
      },
      {
        name: "castVote",
        params: [
          { type: "uint256", name: "proposalId" },
          { type: "uint8", name: "support" },
        ],
        raw: "castVote(uint256,uint8)",
      },
      {
        name: "queue",
        params: [{ type: "uint256", name: "proposalId" }],
        raw: "queue(uint256)",
      },
      {
        name: "execute",
        params: [{ type: "uint256", name: "proposalId" }],
        raw: "execute(uint256)",
      },
      {
        name: "cancel",
        params: [{ type: "uint256", name: "proposalId" }],
        raw: "cancel(uint256)",
      },
      {
        name: "delegate",
        params: [{ type: "address", name: "delegatee" }],
        raw: "delegate(address)",
      },
    ],
  },
  staking: {
    contractName: "StakingRewards",
    functions: [
      {
        name: "stake",
        params: [{ type: "uint256", name: "amount" }],
        raw: "stake(uint256)",
      },
      {
        name: "unstake",
        params: [{ type: "uint256", name: "amount" }],
        raw: "unstake(uint256)",
      },
      {
        name: "claimRewards",
        params: [],
        raw: "claimRewards()",
      },
      {
        name: "notifyRewardAmount",
        params: [{ type: "uint256", name: "reward" }],
        raw: "notifyRewardAmount(uint256)",
      },
    ],
  },
};

export interface GetTemplateInput {
  template_name: string;
}

export function getTemplate(input: GetTemplateInput): FileOutput[] {
  const templateName = input.template_name.toLowerCase() as TemplateName;
  const config = templateConfigs[templateName];

  if (!config) {
    const validNames = Object.keys(templateConfigs).join(", ");
    throw new Error(
      `Unknown template: "${input.template_name}". Valid templates: ${validNames}`
    );
  }

  const { contractName, functions } = config;

  return [
    {
      path: `test/recon/Setup.sol`,
      content: generateSetup(contractName),
    },
    {
      path: `test/recon/BeforeAfter.sol`,
      content: generateBeforeAfter(contractName),
    },
    {
      path: `test/recon/TargetFunctions.sol`,
      content: generateTargetFunctions(contractName, functions),
    },
    {
      path: `test/recon/Properties.sol`,
      content: generateProperties(contractName),
    },
    {
      path: `test/recon/CryticTester.sol`,
      content: generateCryticTester(contractName),
    },
    {
      path: `foundry.toml`,
      content: generateFoundryToml(),
    },
    {
      path: `echidna.yaml`,
      content: generateEchidnaYaml(contractName),
    },
    {
      path: `medusa.json`,
      content: generateMedusaJson(contractName),
    },
  ];
}
