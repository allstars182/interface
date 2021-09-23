import {
  Stats,
  Stat,
  Button,
  Bar,
  Grid,
  Row,
  Col,
  Heading,
  Text,
  Table,
  TableRow,
  TableCell,
  Box,
  Card,
  Pagination,
} from "union-ui";
import Link from "next/link";
import {
  Wrapper,
  CreditContactsRow,
  OutstandingLoans,
  CreditContactsRowSkeleton,
  LendStatsCard,
  NewVouchCard,
} from "components-ui";
import useTrustData from "hooks/data/useTrustData";
import createArray from "util/createArray";

import { config } from "./config";
import { ContactsType } from "views/contacts/config";
import usePagination from "hooks/usePagination";

export default function LendView() {
  const { data: trustData } = useTrustData(8);

  const {
    data: pagedTrustData,
    maxPages,
    page,
    setPage,
  } = usePagination(trustData);

  const isTrustLoading = !trustData;

  return (
    <Wrapper title={config.title} tabItems={config.tabItems}>
      <Grid>
        <Grid.Row justify="center">
          <Grid.Col xs={6}>
            <Box mt="24px">
              <LendStatsCard />
            </Box>

            <NewVouchCard />

            <Card mt="24px">
              <Card.Header
                title="Active Borrowers"
                subTitle="Contacts actively borrowing from your stake"
              />
              <Card.Body>
                <OutstandingLoans data={trustData} />
              </Card.Body>
            </Card>

            <Card mt="24px">
              <Card.Header
                title="Contacts you trust"
                subTitle="Accounts you’re providing credit to"
              />
              <Card.Body>
                <Table>
                  {isTrustLoading
                    ? createArray(3).map((_, i) => (
                        <CreditContactsRowSkeleton key={i} />
                      ))
                    : pagedTrustData.slice(0, 8).map((item) => (
                        <Link
                          key={item.address}
                          href={`/contacts?contactsType=${ContactsType.YOU_TRUST}&contact=${item.address}`}
                        >
                          <CreditContactsRow {...item} />
                        </Link>
                      ))}
                </Table>
                <Pagination
                  mt="18px"
                  pages={maxPages}
                  activePage={page}
                  onClick={setPage}
                />
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
}
