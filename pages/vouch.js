import ApplicationCard from "@components/applicationCard";
import Button from "@components/button";
import CreditRequestModal from "@components/creditRequestModal";
import LabelPair from "@components/labelPair";
import LoggedOutCard from "@components/loggedOutCard";
import VouchBar from "@components/vouchBar";
import VouchTable from "@components/vouchTable";
import { useCreditRequestModalToggle } from "@contexts/Vouch";
import useCurrentToken from "@hooks/useCurrentToken";
import { getCreditLimit } from "@lib/contracts/getCreditLimit";
import { getVouched } from "@lib/contracts/getVouched";
import { useWeb3React } from "@web3-react/core";
import { useAutoEffect, useAutoMemo } from "hooks.macro";
import Head from "next/head";
import { useState } from "react";

/**
 * @name getVouchBarData
 * @param {Array} vouchData
 */
const getVouchBarData = (vouchData) =>
  vouchData.length > 0
    ? vouchData.map(({ vouched }) => parseFloat(vouched))
    : [];

export default function VouchPage() {
  const { account, library, chainId } = useWeb3React();

  if (!(account && library))
    return (
      <div className="my-8 md:my-10">
        <Head>
          <title>Vouch | Union</title>
          <meta property="og:title" content="Vouch | Union" />
          <meta name="twitter:title" content="Vouch | Union" />
        </Head>

        <LoggedOutCard />
      </div>
    );

  const curToken = useCurrentToken();

  const toggleCreditRequestModal = useCreditRequestModalToggle();

  const [creditLimit, setCreditLimit] = useState(0);
  const [vouchData, setVouchData] = useState([]);

  useAutoEffect(() => {
    let isMounted = true;

    const getVouchData = async () => {
      try {
        if (isMounted) {
          const res = await getVouched(account, curToken, library, chainId);

          setVouchData(res);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };

    const getCreditData = async () => {
      try {
        if (isMounted) {
          const res = await getCreditLimit(curToken, account, library, chainId);

          setCreditLimit(res.toFixed(4));
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    };

    getVouchData();
    getCreditData();

    return () => {
      isMounted = false;
    };
  });

  const vouchTableData = useAutoMemo(vouchData);

  return (
    <div className="my-8 md:my-10">
      <Head>
        <title>Vouch | Union</title>
        <meta property="og:title" content="Vouch | Union" />
        <meta name="twitter:title" content="Vouch | Union" />
      </Head>

      <div className="container">
        <ApplicationCard />

        <div className="flex justify-between mb-6">
          <LabelPair
            label="Total credit vouched for you"
            value={creditLimit}
            valueType="DAI"
            large
          />

          <div className="hidden md:block">
            <Button invert onClick={toggleCreditRequestModal}>
              Open request for credit
            </Button>
          </div>
        </div>

        <VouchBar className="mb-10" slices={getVouchBarData(vouchData)} />

        <div className="mb-6">
          <h1>Addresses who vouched for you</h1>

          <Button
            full
            invert
            onClick={toggleCreditRequestModal}
            className="mt-6 inline-block md:hidden"
          >
            Open request for credit
          </Button>
        </div>

        <VouchTable data={vouchTableData} />
      </div>

      <CreditRequestModal />
    </div>
  );
}
