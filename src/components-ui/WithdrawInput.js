import { useForm } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { Button, Box, Dai, Input } from "@unioncredit/ui";

import isHash from "util/isHash";
import format from "util/formatValue";
import { toFixed } from "util/numbers";
import getReceipt from "util/getReceipt";
import activityLabels from "util/activityLabels";
import handleTxError from "util/handleTxError";
import errorMessages from "util/errorMessages";
import { useAddActivity } from "hooks/data/useActivity";
import useStakeWithdraw from "hooks/payables/useStakeWithdraw";

export const WithdrawInput = ({ withdrawableStake, onComplete }) => {
  const addActivity = useAddActivity();
  const withdraw = useStakeWithdraw();

  const { library } = useWeb3React();
  const { handleSubmit, register, setValue, formState, reset, watch } = useForm(
    {
      mode: "onChange",
      reValidateMode: "onChange",
    }
  );

  const { isDirty, isSubmitting, errors } = formState;

  const watchAmount = watch("amount", 0);
  const amount = Number(watchAmount || 0);

  const withdrawableStakeView = format(formatUnits(withdrawableStake, 18), 2);

  const onSubmit = async (values) => {
    try {
      const { hash } = await withdraw(values.amount);
      await getReceipt(hash, library, {
        pending: `Unstaking ${values.amount} DAI`,
        success: `Unstaked ${values.amount} DAI`,
      });
      await onComplete();
      addActivity(activityLabels.withdraw({ amount: values.amount, hash }));
      reset();
    } catch (err) {
      const hash = isHash(err.message) && err.message;
      addActivity(
        activityLabels.withdraw({ amount: values.amount, hash }, true)
      );
      handleTxError(err, `Failed to unstake ${values.amount} DAI`);
    }
  };

  const handleMaxWithdraw = () => {
    setValue("amount", withdrawableStakeView, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const validate = (amount) => {
    if (!amount || amount <= 0) return errorMessages.required;

    const scaled = String(toFixed(amount * 10 ** 18));
    const bnValue = BigNumber.from(scaled);
    if (bnValue.gt(withdrawableStake)) return errorMessages.notEnoughStake;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt="18px">
        <Input
          type="number"
          label="Amount to unstake"
          caption={`Max. ${withdrawableStakeView} DAI`}
          onCaptionClick={handleMaxWithdraw}
          placeholder="0"
          suffix={<Dai />}
          error={errors?.amount?.message}
          {...register("amount", {
            validate,
          })}
        />
      </Box>
      <Button
        fluid
        type="submit"
        mt="18px"
        label={`Unstake ${amount} DAI`}
        loading={isSubmitting}
        disabled={!isDirty}
      />
    </form>
  );
};
