import { Card, Text, Box, Label, Heading } from "@unioncredit/ui";

import format from "util/formatValue";
import useToken from "hooks/useToken";
import useUnionSymbol from "hooks/useUnionSymbol";
import useRewardsData from "hooks/data/useRewardsData";
import useTokenBalance from "hooks/data/useTokenBalance";
import { ClaimButton } from "components-ui";

export const ClaimCard = () => {
  const UNION = useToken("UNION");

  const { data: unionSymbol } = useUnionSymbol();
  const { data: rewardsData, mutate: updateRewardsData } = useRewardsData();
  const { data: unionBalance = 0.0, mutate: updateUnionBalance } =
    useTokenBalance(UNION);

  const { rewards = 0.0 } = !!rewardsData && rewardsData;

  const onComplete = async () => {
    await updateUnionBalance();
    await updateRewardsData();
  };

  return (
    <Card mb="20px">
      <Card.Header title="UNION Token" />
      <Card.Body>
        <Box align="center" justify="space-between">
          <div>
            <Label as="p" size="small">
              Unclaimed
            </Label>
            <Heading size="large">
              {format(rewards, 3)} {unionSymbol}
            </Heading>
          </div>
          <ClaimButton
            label="Claim Tokens"
            variant="secondary"
            onComplete={onComplete}
          />
        </Box>
        <Box direction="vertical">
          <Label as="p" size="small">
            In wallet
          </Label>
          <Heading>
            {format(unionBalance, 3)} {unionSymbol}
          </Heading>
        </Box>
        <Box mt="12px">
          <Text>
            Union is a non-transferrable governance token used exclusively for
            voting on Union Improvement Proposals. Read more
          </Text>
        </Box>
      </Card.Body>
    </Card>
  );
};
