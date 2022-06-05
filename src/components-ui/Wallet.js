import { useWeb3React } from "@web3-react/core";
import { Wallet as UIWallet } from "@unioncredit/ui";

import { networkImages } from "lib/connectors";
import usePublicData from "hooks/usePublicData";
import { Avatar } from "components-ui/Avatar";
import { useAccountModal, AccountModal } from "components-ui/modals";

export function Wallet(props) {
  const { account, chainId } = useWeb3React();
  const { name } = usePublicData(account);
  const { open: openAccountModal } = useAccountModal();

  return (
    <>
      <UIWallet
        {...props}
        avatar={<Avatar address={account} />}
        name={name}
        onClick={openAccountModal}
        networkSrc={networkImages[chainId]}
      />
      <AccountModal />
    </>
  );
}