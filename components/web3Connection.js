import { useWalletModalToggle } from "@contexts/Application";
import useENSName from "@hooks/useENSName";
import truncateAddress from "@util/truncateAddress";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import Button from "./button";
import WalletModal from "./walletModal";
import Web3Button from "./web3Button";

const Identicon = dynamic(() => import("./identicon"));

const Web3Connection = () => {
  const { account, error } = useWeb3React();

  const ENSName = useENSName(account);

  const toggleWalletModal = useWalletModalToggle();

  if (account)
    return (
      <Web3Button onClick={toggleWalletModal}>
        <div className="ml-1 flex items-center">
          <Identicon />
          <div className="ml-3">{ENSName ?? truncateAddress(account)}</div>
        </div>
      </Web3Button>
    );

  if (error)
    return (
      <Web3Button onClick={toggleWalletModal} error>
        {error instanceof UnsupportedChainIdError ? "Wrong Network" : "Error"}
      </Web3Button>
    );

  return (
    <Button
      className="bg-primary-100 border-primary-100"
      onClick={toggleWalletModal}
    >
      Start now
    </Button>
  );
};

export default () => (
  <Fragment>
    <Web3Connection />
    <WalletModal />
  </Fragment>
);