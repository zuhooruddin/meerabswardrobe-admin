import { Avatar, Box, Button, Card, Grid, Typography, styled, Tab } from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import TableRow from "components/TableRow";
import { H5, Small } from "components/Typography";
import { AdminEditForm } from "pages-sections/admin";
import { AdminChangePasswordForm } from "pages-sections/admin";
import { AdminChangeImageForm } from "pages-sections/admin";
import {server_ip} from "utils/backend_server_ip.jsx"


import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState } from "react";


const StyledTabPanel = styled(TabPanel)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
}));
const StyledTabList = styled(TabList)(({ theme }) => ({
  "& .MuiTab-root.Mui-selected": {
    color: theme.palette.info.main,
  },
  "& .MuiTabs-indicator": {
    background: theme.palette.info.main,
  },
}));

const AdminProfileForm = ({adminDetail}) => {
  const imgBaseUrl = server_ip+"media/"
  const [selectTab, setSelectTab] = useState("edit-profile");

  return (
    
<Card
      sx={{
        p: 6,
      }}
    >
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                p: "14px 32px",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Avatar
                src={imgBaseUrl+adminDetail['profile_pic']}
                sx={{
                  height: 64,
                  width: 64,
                }}
              />

              <Box ml={1.5} flex="1 1 0">
                <FlexBetween flexWrap="wrap">
                  <div>
                    <H5 my="0px">{adminDetail['name']}</H5>
                    <FlexBox alignItems="center">
                      <Typography color="grey.600">Status:</Typography>
                      <Typography ml={0.5} color="primary.main">
                        ACTIVE
                      </Typography>
                    </FlexBox>
                  </div>

                  <Typography color="grey.600" letterSpacing="0.2em">
                    {adminDetail['role']==1?"SUPER ADMIN USER":"ADMIN USER"}
                  </Typography>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <TableRow
        sx={{
          p: "0.75rem 1.5rem",
        }}
      >
        <FlexBox flexDirection="column" p={1}>
          <Small color="grey.600" mb={0.5} textAlign="left">
            Full Name
          </Small>
          <span>{adminDetail['name']}</span>
        </FlexBox>

        {/* <FlexBox flexDirection="column" p={1}>
          <Small color="grey.600" mb={0.5} textAlign="left">
            Last Name
          </Small>
          <span>Edwards</span>
        </FlexBox> */}

        <FlexBox flexDirection="column" p={1}>
          <Small color="grey.600" mb={0.5} textAlign="left">
            Email
          </Small>
          <span>{adminDetail['email']}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p={1}>
          <Small color="grey.600" mb={0.5} textAlign="left">
            Phone
          </Small>
          <span>{adminDetail['mobile']}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p={1}>
          <Small color="grey.600" mb={0.5}>
            Status
          </Small>
          <span className="pre">
          {adminDetail['status']==1?"ACTIVE":adminDetail['status']==2?"PENDING":"INACTIVE"}
          </span>
        </FlexBox>
      </TableRow>
        <br/>
        <br/>
      <TabContext value={selectTab} >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "grey.300",
            }}
          >
            <StyledTabList
              onChange={(_, value) => setSelectTab(value)}
              variant="scrollable"
            >
              <Tab label="Edit Profile" value="edit-profile" disableRipple />
              <Tab label="Change Password" value="change-password" disableRipple />
              <Tab label="Change Profile Image" value="change-profile-image" disableRipple />
            </StyledTabList>
          </Box>

          <StyledTabPanel value="edit-profile">
            <AdminEditForm adminDetail = {adminDetail}/>
          </StyledTabPanel>

          <StyledTabPanel value="change-password">
            <AdminChangePasswordForm adminDetail = {adminDetail} />
          </StyledTabPanel>

          <StyledTabPanel value="change-profile-image">
            <AdminChangeImageForm adminId = {adminDetail['id']} />
          </StyledTabPanel>

        </TabContext>

      </Card>

  );
};

const infoList = [
  {
    title: "16",
    subtitle: "All Orders",
  },
  {
    title: "02",
    subtitle: "Awaiting Payments",
  },
  {
    title: "00",
    subtitle: "Awaiting Shipment",
  },
  {
    title: "01",
    subtitle: "Awaiting Delivery",
  },
];
export default AdminProfileForm;
