import { Notifications } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Badge,
  Box,
  ClickAwayListener,
  Fade,
  IconButton,
  Paper,
  Popper,
  styled,
  Tab,
} from "@mui/material";
import { FlexBox } from "components/flex-box";
import CartCheck from "components/icons/CartCheck";
import CartX from "components/icons/CartX";
import TruckFast from "components/icons/TruckFast";
import { H6, Paragraph } from "components/Typography";
import { formatDistance } from "date-fns";
import { useState } from "react"; // dummy  data
import useSWR, { useSWRConfig } from 'swr'
import axios from "axios";
import {useSession} from 'next-auth/react';
import {server_ip} from "utils/backend_server_ip.jsx"
import { useRouter } from "next/router";

const orders = [
  {
    id: "5e8883f1b51cc1956a5a1ec0",
    createdAt: new Date("6/21/2022"),
    title: "New order received",
    type: "new_message",
    icon: CartCheck,
  },
  {
    id: "5e8883f7ed1486d665d8be1e",
    createdAt: new Date("6/20/2022"),
    title: "Order Delivered Successfully",
    type: "new_message",
    icon: TruckFast,
  },
  {
    id: "5e8883fca0e8612044248ecf",
    createdAt: new Date("6/19/2022"),
    title: "Order Cancellation Request",
    type: "item_shipped",
    icon: CartX,
  },
];
const archives = [
  {
    id: "5e8883f1b51cc1956a5a1ec0",
    createdAt: new Date("6/21/2022"),
    title: "New order received",
    type: "new_message",
    icon: CartCheck,
  },
  {
    id: "5e8883f7ed1486d665d8be1e",
    createdAt: new Date("6/20/2022"),
    title: "Order Delivered Successfully",
    type: "new_message",
    icon: TruckFast,
  },
  {
    id: "5e8883fca0e8612044248ecf",
    createdAt: new Date("6/19/2022"),
    title: "Order Cancellation Request",
    type: "item_shipped",
    icon: CartX,
  },
]; // styled components

const StyledTabList = styled(TabList)(({ theme }) => ({
  "& .MuiTab-root": {
    textTransform: "capitalize",
  },
  "& .MuiTab-root.Mui-selected": {
    color: theme.palette.info.main,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.info.main,
  },
}));
const StyledTab = styled(Tab)(() => ({
  width: "50%",
  marginLeft: 0,
  marginRight: 0,
}));
const ListItemWrapper = styled(FlexBox)(({ theme }) => ({
  cursor: "pointer",
  borderBottom: `1px solid ${theme.palette.info[100]}`,
  ":hover": {
    backgroundColor: theme.palette.info[100],
  },
}));

const NotificationsPopover = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: session, status } = useSession()

  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(server_ip+`getAllOrderNotification`, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  // if(data)console.log(data);

  const handleClick = (event) => {
    setOpen((state) => !state);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleTabChange = (_, value) => {
    setTabValue(value);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        <IconButton onClick={handleClick}>
          <Badge color="secondary"  badgeContent={data?data.length:null}>
            <Notifications
              sx={{
                color: "grey.500",
              }}
            />
          </Badge>
        </IconButton>

        <Popper
          transition
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{
            zIndex: 11111,
            maxWidth: 300,
            minWidth: 300,
            width: "100%",
            // overflow: "hidden",
            maxHeight: 400,
            overflow: 'auto',
            top: "10px !important",
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={150}>
              <Paper>
                <TabContext value={tabValue}>
                  <StyledTabList onChange={handleTabChange}>
                    <StyledTab disableRipple value="1" label={`Unread (${data?data.length:null})`} />
                    {/* <StyledTab disableRipple value="2" label="Archived" /> */}
                  </StyledTabList>

                  {data.length === 0 ? (
                    <Paragraph fontWeight="500" textAlign="center" p={2}>
                      There are no notifications
                    </Paragraph>
                  ) : (
                    <TabPanel
                      value="1"
                      sx={{
                        p: 0,
                      }}
                    >
                      {data.map((order) => (
                        <ListItem
                          key={order.id}
                          type="new_message"
                          // type={order.type}
                          // Icon={order.icon}
                          Icon={CartCheck}
                          title={order.custName+' Placed New Order'}
                          createdAt={new Date(order.timestamp)}
                          orderNo = {order.orderNo}
                          handleClose = {handleClose}
                          // createdAt={order.createdAt}
                        />
                      ))}
                    </TabPanel>
                  )}

                  {/* {archives.length === 0 ? (
                    <Paragraph fontWeight="500" textAlign="center" p={2}>
                      There are no archives
                    </Paragraph>
                  ) : (
                    <TabPanel
                      value="2"
                      sx={{
                        p: 0,
                      }}
                    >
                      {archives.map((item) => (
                        <ListItem
                          key={item.id}
                          type={item.type}
                          Icon={item.icon}
                          title={item.title}
                          createdAt={item.createdAt}
                        />
                      ))}
                    </TabPanel>
                  )} */}
                </TabContext>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}; // ListItem component props

function ListItem(props) {
  const router = useRouter();
  const { Icon, title, createdAt,orderNo,handleClose } = props;
  return (
    <ListItemWrapper p={2} gap={2} alignItems="center" onClick={() => {handleClose();window.location.href = `/admin/orders/${orderNo}`}}>
      <Icon color="info" />

      <Box>
        <H6 fontSize={13}>{title}</H6>
        <Paragraph fontSize={11}>
          {formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })}
        </Paragraph>
      </Box>
    </ListItemWrapper>
  );
}

export default NotificationsPopover;
