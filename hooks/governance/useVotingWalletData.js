import { formatUnits } from "@ethersproject/units";
import { useGovernanceTokenContract } from "hooks/governance/useGovernanceContract";
import useSWR from "swr";

const getVotingWalletData = (governanceTokenContract) => async (_, address) => {
  const balanceOf = await governanceTokenContract.balanceOf(address);

  const currentVotes = await governanceTokenContract.getCurrentVotes(address);

  /**
   * @type {string}
   */
  const delegates = await governanceTokenContract.delegates(address);

  return {
    balanceOf: parseFloat(formatUnits(balanceOf, 18)),
    currentVotes: parseFloat(formatUnits(currentVotes, 18)),
    delegates: delegates === address ? "Self" : delegates,
  };
};

export default function useVotingWalletData(address) {
  const governanceTokenContract = useGovernanceTokenContract();

  const shouldFetch = typeof address === "string" && !!governanceTokenContract;

  return useSWR(
    shouldFetch ? ["VotingWalletData", address] : null,
    getVotingWalletData(governanceTokenContract),
    {
      refreshInterval: 10 * 1000,
      dedupingInterval: 10 * 1000,
    }
  );
}
