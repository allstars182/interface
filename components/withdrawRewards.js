import { useWeb3React } from "@web3-react/core";
import { useAutoCallback } from "hooks.macro";
import useCurrentToken from "hooks/useCurrentToken";
import useToast, { FLAVORS } from "hooks/useToast";
import useUnionContract from "hooks/useUnionContract";
import { useState } from "react";
import handleTxError from "util/handleTxError";

const WithdrawRewards = ({ onComplete }) => {
  const { account, chainId, library } = useWeb3React();
  const curToken = useCurrentToken();

  const [withdrawing, setWithdrawing] = useState(false);

  const unionContract = useUnionContract();

  const addToast = useToast();

  const onWithdrawRewards = useAutoCallback(async () => {
    setWithdrawing(true);

    const { hide: hideWaiting } = addToast(FLAVORS.TX_WAITING);

    try {
      const tx = await unionContract.withdrawRewards(account, curToken);

      hideWaiting();

      const { hide: hidePending } = addToast(
        FLAVORS.TX_PENDING(tx.hash, chainId)
      );

      const receipt = await library.waitForTransaction(tx.hash);

      if (receipt.status === 1) {
        hidePending();

        addToast(FLAVORS.TX_SUCCESS(tx.hash, chainId));

        setWithdrawing(false);

        onComplete();

        return;
      }

      hidePending();

      throw new Error(receipt.logs[0]);
    } catch (err) {
      setWithdrawing(false);
      hideWaiting();

      const message = handleTxError(err);

      addToast(FLAVORS.TX_ERROR(message));
    }
  });

  return (
    <button
      className="text-sm font-semibold underline focus:outline-none"
      disabled={withdrawing}
      onClick={onWithdrawRewards}
    >
      {withdrawing ? "Withdrawing Rewards..." : "Withdraw Rewards"}
    </button>
  );
};

export default WithdrawRewards;
