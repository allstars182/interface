import { isAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import useCurrentToken from "./useCurrentToken";
import useMemberContract from "./contracts/useMemberContract";

const getTrustCount = (contract) => async (_, account, tokenAddress) =>
  contract
    .trustList(account, tokenAddress)
    .then((res) => parseInt(res.toString()));

export default function useTrustCountData() {
  const { account } = useWeb3React();
  const memberContract = useMemberContract();
  const curToken = useCurrentToken();

  const shouldFetch =
    !!memberContract && typeof account === "string" && isAddress(curToken);

  return useSWR(
    shouldFetch ? ["TrustCount", account, curToken] : null,
    getTrustCount(memberContract)
  );
}
