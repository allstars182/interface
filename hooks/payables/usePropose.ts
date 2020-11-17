import { defaultAbiCoder } from "@ethersproject/abi";
import type { TransactionResponse } from "@ethersproject/providers";
import useGovernanceContract from "hooks/contracts/useGovernanceContract";
import { useCallback } from "react";
import type { Proposal } from "types";

const encode = (type: string, value: string) =>
  defaultAbiCoder.encode([type], [value]);

export default function usePropose() {
  const governanceContract = useGovernanceContract();

  return useCallback(
    async (data: Proposal): Promise<TransactionResponse> => {
      const targets = data.actions.flatMap((action) => action.targets);
      const values = data.actions.flatMap((action) => action.values);
      const signatures = data.actions.flatMap((action) => action.signatures);
      const calldatas = data.actions
        .flatMap((action) => action.calldata)
        .map((data) => encode(data.type, data.value));

      const description = `
${data.title}

${data.description}`;

      return governanceContract.propose(
        targets,
        values,
        signatures,
        calldatas,
        description
      );
    },
    [governanceContract]
  );
}
