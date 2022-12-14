import { Nav, NavItem, Button, Box, ContextMenu, Grid } from "@unioncredit/ui";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { navItems } from "constants/app";
import { ContextMenuLink } from "./ContextMenuLink";
import { contextMenuItems } from "constants/app";
import { useForceConnect } from "hooks/useForceConnect";
import useIsMember from "hooks/data/useIsMember";
import { Wallet, UnionWallet } from "components-ui";
import { NetworkSelect } from "./NetworkSelect";

export const Navigation = ({ mobile }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { account } = useWeb3React();
  const [, setForceConnect] = useForceConnect();

  const { data: isMember } = useIsMember();

  const filteredNavItems = useMemo(() => {
    if (typeof isMember !== "boolean") {
      return [];
    }

    const filteredNavItems = isMember
      ? navItems.slice(1)
      : navItems.filter((x) => ["get-started", "governance"].includes(x.id));

    return filteredNavItems.map((item) => ({
      ...item,
      active:
        item.pathname === "/"
          ? item.pathname === pathname
          : item.id === "credit"
          ? pathname.match(/\/(stake|credit)/)
          : pathname.startsWith(item.pathname),
    }));
  }, [isMember, pathname]);

  const handleLogoClick = () => {
    navigate(isMember ? "/credit" : "/");
  };

  const contextMenuItemsLink = contextMenuItems.map((item) => {
    if (item.href.startsWith("/")) {
      return { ...item, as: ContextMenuLink };
    }
    return item;
  });

  const navigation = (
    <Box fluid justify="center">
      {account &&
        filteredNavItems.map(({ label, ...item }) => (
          <Link
            passHref
            key={item.id}
            to={item.pathname}
            style={{ display: "block" }}
          >
            <NavItem as="div" label={!mobile && label} {...item} />
          </Link>
        ))}
    </Box>
  );

  return (
    <Nav mobile={mobile} onLogoClick={handleLogoClick}>
      <Grid>
        <Grid.Row align="center">
          <Grid.Col>
            <Box align="center">
              <Logo width="32px" style={{ marginRight: "8px" }} />
              <NetworkSelect />
            </Box>
          </Grid.Col>
          <Grid.Col align="center" className="hide-lt-850">
            {navigation}
          </Grid.Col>
          <Grid.Col align="right">
            <Box justify="flex-end">
              {account ? (
                <>
                  <UnionWallet />
                  <Wallet />
                </>
              ) : (
                <Button
                  label="Login"
                  variant="secondary"
                  className="loginButton"
                  onClick={() => setForceConnect(true)}
                />
              )}
              <ContextMenu position="left" items={contextMenuItemsLink} />
            </Box>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Box my="16px" className="hide-gt-850" fluid>
            <Grid.Col align="center">{navigation}</Grid.Col>
          </Box>
        </Grid.Row>
      </Grid>
    </Nav>
  );
};
