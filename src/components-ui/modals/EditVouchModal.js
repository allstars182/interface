import { useForm } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import { Grid, Button, ModalOverlay, Input, Stat } from "@unioncredit/ui";

import { Dai, Modal } from "components-ui";
import isHash from "util/isHash";
import format from "util/formatValue";
import getReceipt from "util/getReceipt";
import handleTxError from "util/handleTxError";
import errorMessages from "util/errorMessages";
import activityLabels from "util/activityLabels";
import useTrustData from "hooks/data/useTrustData";
import { useModal, useModalOpen } from "hooks/useModal";
import useCreditLimit from "hooks/data/useCreditLimit";
import { useAddActivity } from "hooks/data/useActivity";
import useAdjustTrust from "hooks/payables/useAdjustTrust";
import { formatUnits } from "@ethersproject/units";

export const EDIT_VOUCH_MODAL = "edit-vouch-modal";

export const useEditVouchModal = () => useModal(EDIT_VOUCH_MODAL);

export const useEditVouchModalOpen = () => useModalOpen(EDIT_VOUCH_MODAL);

export function EditVouchModal({ address, used, trust }) {
  const addActivity = useAddActivity();
  const { library } = useWeb3React();
  const { close } = useEditVouchModal();
  const adjustTrust = useAdjustTrust();
  const { mutate: updateTrustData } = useTrustData();
  const { mutate: updateCreditLimit } = useCreditLimit();

  const { register, formState, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const isOpen = useEditVouchModalOpen();

  if (!isOpen) return null;

  const { isDirty, isSubmitting, errors } = formState;

  const validate = (val) => {
    if (Number(val) <= used) return errorMessages.cantRemoveStake;
    if (Number(val) <= 0) return errorMessages.minValueZero;
    if (!val) return errorMessages.required;

    return true;
  };

  const handleAdjustTrust = async (values) => {
    try {
      const { hash } = await adjustTrust(address, values.amount);
      await getReceipt(hash, library);
      addActivity(
        activityLabels.adjustVouch({ address, amount: values.amount, hash })
      );
      await updateTrustData();
      await updateCreditLimit();
      close();
    } catch (err) {
      const hash = isHash(err.message) && err.message;
      addActivity(
        activityLabels.adjustVouch(
          { address, amount: values.amount, hash },
          true
        )
      );
      handleTxError(err);
    }
  };

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Change trust amount" onClose={close}>
        <form onSubmit={handleSubmit(handleAdjustTrust)}>
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Stat
                  mb="24px"
                  size="medium"
                  align="center"
                  label="Current trust"
                  value={<Dai value={format(formatUnits(trust), 2)} />}
                />
              </Grid.Col>
              <Grid.Col>
                <Stat
                  mb="24px"
                  size="medium"
                  align="center"
                  label="Unpaid debt"
                  value={<Dai value={format(formatUnits(used), 2)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          <Input
            type="number"
            {...register("amount", { validate })}
            label="New trust amount"
            suffix={<Dai />}
            error={errors.amount?.message}
          />
          <Button
            mt="18px"
            fluid
            label="Save"
            fontSize="large"
            type="submit"
            disabled={!isDirty}
            loading={isSubmitting}
          />
        </form>
      </Modal>
    </ModalOverlay>
  );
}