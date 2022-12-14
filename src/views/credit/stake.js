import { Grid, Card, Box } from "@unioncredit/ui";
import {
  View,
  OutstandingLoans,
  LendStatsCard,
  NewVouchCard,
} from "components-ui";
import useTrustData from "hooks/data/useTrustData";

import { config } from "./config";

export default function StakeView() {
  const { data: trustData } = useTrustData();

  return (
    <View tabItems={config.tabItems}>
      <Grid>
        <Grid.Row justify="center">
          <Grid.Col>
            <Box mt="24px">
              <LendStatsCard />
            </Box>

            <NewVouchCard />

            <Card mt="24px">
              <Card.Header
                title="Active Borrowers"
                subTitle="Contacts actively borrowing from your stake"
              />
              <Box mb="24px" />
              <OutstandingLoans data={trustData} />
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </View>
  );
}
