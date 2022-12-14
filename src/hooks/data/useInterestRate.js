import useSWR from "swr";
import { formatUnits } from "@ethersproject/units";

import useToken from "hooks/useToken";
import useChainId from "hooks/useChainId";
import useUToken from "hooks/contracts/useUToken";
import { BLOCKS_PER_YEAR } from "constants/variables";

async function fetchInterestRate(_, uToken, chainId) {
  const borrowRatePerBlock = await uToken.borrowRatePerBlock();
  const borrowRatePerYear = borrowRatePerBlock.mul(BLOCKS_PER_YEAR[chainId]);
  return formatUnits(borrowRatePerYear, 18);
}

export default function useInterestRate() {
  const DAI = useToken("DAI");
  const uToken = useUToken(DAI);
  const chainId = useChainId();
  const shouldFetch = uToken && chainId;

  return useSWR(
    shouldFetch ? ["interestRate", uToken, chainId] : null,
    fetchInterestRate
  );
}
