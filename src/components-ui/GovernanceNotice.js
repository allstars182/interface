import { useWeb3React } from "@web3-react/core";
import { Box, Heading, Card, Text, Button, Avatar } from "@unioncredit/ui";
import { ReactComponent as Switch } from "@unioncredit/ui/lib/icons/switch.svg";

import { options, switchChain } from "util/switchChain";

export function GovernanceNotice() {
  const { library } = useWeb3React();

  const handleClick = () => {
    switchChain(options[0], library.provider);
  };

  return (
    <Card variant="blue" mt="24px">
      <Card.Body>
        <Box align="center" justify="center" fluid mb="24px">
          <Avatar src="/images/ethereum-avatar.png" size={48} />
        </Box>
        <Heading align="center" mb={0}>
          Union Governance on Ethereum
        </Heading>
        <Text align="center" mb="24px">
          Voting on proposals isn’t supported on Arbitrum. Switch to Ethereum’s
          Mainnet in order to take part in Union Governance.
        </Text>
        <Button
          fluid
          icon={Switch}
          onClick={handleClick}
          label="Switch Network to Ethereum"
        />
      </Card.Body>
    </Card>
  );
}
