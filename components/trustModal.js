import Modal, { ModalHeader } from "./modal";
import { useTrustModalOpen, useTrustModalToggle } from "@contexts/Stake";
import Button from "./button";
import Input from "./input";

const TrustModal = () => {
  const open = useTrustModalOpen();
  const toggle = useTrustModalToggle();

  return (
    <Modal isOpen={open} onDismiss={toggle}>
      <ModalHeader title="Vouch for a member" onDismiss={toggle} />

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <Input
          className="mb-4"
          id="address"
          label="Address or ENS Name"
          placeholder="Enter address or ENS"
        />

        <Input
          chip="DAI"
          className="mb-4"
          id="trust"
          type="number"
          label="Trust amount"
          placeholder="0.00"
          tip="The amount you trust this address to borrow and be able to repay."
        />

        <div className="mt-20">
          <Button type="submit" full>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrustModal;