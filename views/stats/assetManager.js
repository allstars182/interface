import { Fragment } from "react";
import StatsNavigation from "components/stats/StatsNavigation";
import StatsCard from "components/stats/StatsCard";
import StatsGrid from "components/stats/StatsGrid";
import useLoanableAmount from "hooks/stats/useLoanableAmount";
import usePoolBalance from "hooks/stats/usePoolBalance";
import useAssetManagerDAIBalance from "hooks/stats/useAssetManagerDAIBalance";
import format from "util/formatValue";

export default function AssetManagerStatsView() {
  const { data: loanableAmount } = useLoanableAmount();
  const { data: poolBalance } = usePoolBalance();
  const { data: assetManagerDAIBalance } = useAssetManagerDAIBalance();

  return (
    <Fragment>
      <section className="mb-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl">Union Stats</h1>
          </div>

          <StatsNavigation />
        </div>
      </section>

      <section className="mb-8">
        <div className="container">
          <div className="divider" />
        </div>
      </section>

      <section className="mb-8">
        <div className="container">
          <StatsGrid>
            <StatsCard
              label="Available Credit"
              value={format(loanableAmount)}
            />
            <StatsCard label="Pool Balance" value={format(poolBalance)} />
            <StatsCard
              label="DAI in Contract"
              value={format(assetManagerDAIBalance)}
            />
          </StatsGrid>
        </div>
      </section>
    </Fragment>
  );
}
