export interface PropertyDef {
  name: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  skeleton: string;
}

export const erc20Properties: PropertyDef[] = [
  {
    name: "invariant_totalSupply_equals_sum_of_balances",
    description:
      "The total supply must always equal the sum of all individual balances",
    severity: "critical",
    skeleton: `    function invariant_totalSupply_equals_sum_of_balances() public view returns (bool) {
        uint256 sumBalances = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            sumBalances += target.balanceOf(actors[i]);
        }
        return target.totalSupply() == sumBalances;
    }`,
  },
  {
    name: "invariant_transfer_conservation",
    description:
      "A transfer must decrease sender balance and increase receiver balance by exactly the same amount",
    severity: "critical",
    skeleton: `    function invariant_transfer_conservation() public view returns (bool) {
        return _after.totalSupply == _before.totalSupply;
    }`,
  },
  {
    name: "invariant_allowance_decreases_on_transferFrom",
    description:
      "After a transferFrom, the allowance must decrease by the transferred amount (unless infinite)",
    severity: "high",
    skeleton: `    function invariant_allowance_decreases_on_transferFrom() public view returns (bool) {
        // Track allowance changes in BeforeAfter snapshots
        return true; // Implement with ghost variable tracking
    }`,
  },
  {
    name: "invariant_zero_address_no_balance",
    description: "The zero address should never hold a positive balance",
    severity: "high",
    skeleton: `    function invariant_zero_address_no_balance() public view returns (bool) {
        return target.balanceOf(address(0)) == 0;
    }`,
  },
  {
    name: "invariant_transfer_to_self_no_change",
    description:
      "Transferring tokens to yourself must not change the total supply or your balance",
    severity: "medium",
    skeleton: `    function invariant_transfer_to_self_no_change() public view returns (bool) {
        // Compare before/after balance for self-transfers
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_approve_does_not_change_balance",
    description:
      "Calling approve must not change any balance or the total supply",
    severity: "medium",
    skeleton: `    function invariant_approve_does_not_change_balance() public view returns (bool) {
        return _after.totalSupply == _before.totalSupply;
    }`,
  },
  {
    name: "invariant_mint_increases_total_supply",
    description:
      "If minting is supported, total supply must increase by exactly the minted amount",
    severity: "high",
    skeleton: `    function invariant_mint_increases_total_supply() public view returns (bool) {
        // Check _after.totalSupply >= _before.totalSupply when mint was called
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_burn_decreases_total_supply",
    description:
      "If burning is supported, total supply must decrease by exactly the burned amount",
    severity: "high",
    skeleton: `    function invariant_burn_decreases_total_supply() public view returns (bool) {
        // Check _after.totalSupply <= _before.totalSupply when burn was called
        return true; // Implement with handler tracking
    }`,
  },
];
