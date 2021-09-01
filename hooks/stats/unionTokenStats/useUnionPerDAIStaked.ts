import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import useComptrollerContract from "hooks/contracts/useComptrollerContract";
import useUserContract from "hooks/contracts/useUserContract";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";

const offsetPower = 18;
const offset = BigNumber.from(10).pow(offsetPower);

const getUnionPerDAIStaked =
  (comptroller: Contract, userContract: Contract) => async (_: any) => {
    const totalStaked: BigNumber = await userContract.totalStaked();
    const totalFrozen: BigNumber = await userContract.totalFrozen();
    const effectiveTotalStake: BigNumber = totalStaked.sub(totalFrozen);
    const ipb = await comptroller.inflationPerBlock(effectiveTotalStake);

    return formatUnits(ipb.mul(offset).div(effectiveTotalStake), offsetPower);
  };

export default function useUnionPerDAIStaked() {
  const comptroller: Contract = useComptrollerContract();
  const userContract: Contract = useUserContract();

  const shouldFetch = !!comptroller && !!userContract;
  return useSWR(
    shouldFetch ? ["unionPerDAIStaked"] : null,
    getUnionPerDAIStaked(comptroller, userContract)
  );
}