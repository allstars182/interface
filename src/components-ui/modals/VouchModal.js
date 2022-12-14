import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "@ethersproject/address";
import { ReactComponent as Info } from "@unioncredit/ui/lib/icons/wireInfo.svg";
import { ModalOverlay, Box, Input, Button, Alert } from "@unioncredit/ui";

import { useModal, useModalOpen } from "hooks/useModal";
import useTrustData from "hooks/data/useTrustData";
import useAddressLabels from "hooks/useAddressLabels";
import { useAddActivity } from "hooks/data/useActivity";
import useAdjustTrust from "hooks/payables/useAdjustTrust";
import isHash from "util/isHash";
import getReceipt from "util/getReceipt";
import errorMessages from "util/errorMessages";
import handleTxError from "util/handleTxError";
import activityLabels from "util/activityLabels";
import truncateAddress from "util/truncateAddress";
import { Dai, MiniAccountSummary, Modal, AddressInput } from "components-ui";
import { generateHandleChange } from "components-ui/AddressInput";
import useMaxTrust from "hooks/useMaxTrust";

export const VOUCH_MODAL = "vouch-modal";

export const useVouchModal = () => useModal(VOUCH_MODAL);

export const useVouchModalOpen = () => useModalOpen(VOUCH_MODAL);

export function VouchModal({ address: inputAddress }) {
  const maxTrust = useMaxTrust();
  const adjustTrust = useAdjustTrust();
  const addActivity = useAddActivity();

  const { close } = useVouchModal();
  const { setLabel } = useAddressLabels();
  const { library, account } = useWeb3React();
  const { data: trustData, mutate: updateTrustData } = useTrustData();

  const defaultAddressValue = useMemo(() => {
    if (inputAddress) return inputAddress;
    const search = new URLSearchParams(window.location.search);
    return search.get("address");
  }, [inputAddress]);

  const {
    formState,
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { address: defaultAddressValue },
  });

  useEffect(() => {
    register("address");
  }, []);

  const isOpen = useVouchModalOpen();

  if (!isOpen) return null;

  const { isDirty, isSubmitting, errors } = formState;

  const onNavigateToProfile = () => {
    close();
  };

  const watchAddress = watch("address");
  const address = isAddress(watchAddress) && watchAddress;

  const handleNewVouch = async (data) => {
    try {
      const { hash } = await adjustTrust(data.address, data.amount);
      setLabel(data.address, data.alias);
      await getReceipt(hash, library, {
        pending: `Vouching ${data.amount} DAI for ${truncateAddress(
          data.address
        )}`,
        success: `Vouched ${data.amount} DAI for ${truncateAddress(
          data.address
        )}`,
      });
      addActivity(
        activityLabels.newVouch({
          address: data.address,
          amount: data.amount,
          hash,
        })
      );
      await updateTrustData();
      close();
    } catch (err) {
      const hash = isHash(err.message) && err.message;
      addActivity(
        activityLabels.newVouch(
          { address: data.address, amount: data.amount, hash },
          true
        )
      );
      handleTxError(err, `Failed to vouch ${data.amount} DAI`);
    }
  };

  const handleAddressInputChange = generateHandleChange({
    clearErrors,
    setValue,
    setError,
    validate: (address) => {
      if (address.toLowerCase() === account.toLowerCase()) {
        return errorMessages.notVouchSelf;
      }
      return true;
    },
  });

  const maxTrustData = trustData?.length >= maxTrust;

  return (
    <ModalOverlay onClick={close}>
      <Modal title="New vouch" onClose={close}>
        <MiniAccountSummary
          onClick={onNavigateToProfile}
          address={!errors.address?.message && address}
        />
        <form onSubmit={handleSubmit(handleNewVouch)}>
          <AddressInput
            name="address"
            label="Address or ENS"
            disabled={maxTrustData}
            placeholder="e.g. 0xA1e3..."
            error={errors.address?.message}
            onChange={handleAddressInputChange}
            defaultValue={defaultAddressValue}
          />
          <Box mt="8px">
            <Input
              label="Alias"
              {...register("alias")}
              disabled={maxTrustData}
              placeholder="e.g. Halkyone Olga"
            />
          </Box>
          <Box mt="16px">
            <Input
              {...register("amount", {
                required: errorMessages.required,
                min: {
                  value: 1.0,
                  message: errorMessages.minValueOnePointZero,
                },
              })}
              suffix={<Dai />}
              type="number"
              label="Trust amount"
              placeholder="0.0"
              disabled={maxTrustData}
              error={errors?.amount?.message}
            />
          </Box>
          <Box mt="32px" direction="vertical">
            {maxTrustData && (
              <Alert
                packed
                size="small"
                label={`You have reached the max trust limit of ${trustData?.length} vouches`}
                icon={<Info />}
              />
            )}
            <Button
              fluid
              mt="8px"
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty || maxTrustData}
              label="Confirm vouch"
            />
          </Box>
        </form>
      </Modal>
    </ModalOverlay>
  );
}
