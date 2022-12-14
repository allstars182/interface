import { useState } from "react";
import { Button } from "@unioncredit/ui";
import { useWeb3React } from "@web3-react/core";
import useWithdrawRewards from "hooks/payables/useWithdrawRewards";
import getReceipt from "util/getReceipt";
import handleTxError from "util/handleTxError";
import { useAddActivity } from "hooks/data/useActivity";
import useUnionSymbol from "hooks/useUnionSymbol";
import activityLabels from "util/activityLabels";
import useRewardsData from "hooks/data/useRewardsData";
import isHash from "util/isHash";
import { addToast, FLAVORS } from "hooks/useToast";
import { formatUnits } from "@ethersproject/units";
import format from "util/formatValue";

export function ClaimButton({ onComplete, label, ...props }) {
  const addActivity = useAddActivity();
  const { data: unionSymbol } = useUnionSymbol();
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const withdrawRewards = useWithdrawRewards();
  const { data: rewardsData } = useRewardsData();
  const { rewards = 0.0 } = !!rewardsData && rewardsData;

  const handleClaim = async () => {
    if (rewards.lte(0)) {
      addToast(FLAVORS.ERROR("No rewards to claim"));
      return;
    }

    const displayRewards = format(formatUnits(rewards), 2);

    try {
      setLoading(true);
      const { hash } = await withdrawRewards();
      await getReceipt(hash, library, {
        pending: `Claiming ${displayRewards} ${unionSymbol}`,
        success: `Claimed ${displayRewards} ${unionSymbol}`,
      });
      addActivity(activityLabels.claim({ amount: rewards, hash }));
      setLoading(false);
      if (typeof onComplete === "function") {
        await onComplete();
      }
    } catch (err) {
      setLoading(false);
      const hash = isHash(err.message) && err.message;
      addActivity(activityLabels.claim({ amount: rewards, hash }, true));
      handleTxError(err, `Failed to claim ${displayRewards} ${unionSymbol}`);
    }
  };

  return (
    <Button {...props} label={label} onClick={handleClaim} loading={loading} />
  );
}
