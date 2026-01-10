import { Avatar, Box, IconButton, Menu, MenuItem, styled } from "@mui/material";
import { H6, Small } from "components/Typography";
import React, { useState } from "react"; // styled components
import Link from 'next/link'
import {useSession,signIn,signOut} from 'next-auth/react';
import {server_ip} from "utils/backend_server_ip.jsx"
import axiosInstance from "axios";
import { toast } from 'react-toastify';


const Divider = styled(Box)(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const AccountPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const { data: session } = useSession();

async function tokenBlacklist(){
  const payload = {
    // refresh: session.refreshToken,
    userId:session.user.id,
    accessToken: session.accessToken
  };
  try {
    const response = await fetch(`${server_ip}apiSignOut`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }

    })
    const res = await response.json()
    if(res['ErrorCode'] == 0){
            // toast.success(res.data['ErrorMsg'], {
            //   position: toast.POSITION.TOP_RIGHT
            // });
            signOut();
          }
    else{toast.error(res['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});}
    return res;
  } catch (error) {
    if (error.response) {
        if(error.response.status==400){
          for(var i=0;i<Object.keys(error.response.data).length;i++){
            var key = Object.keys(error.response.data)[i];
            var value = error.response.data[key].toString();
            toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
          }
        }
        else{toast.error('Error Occured! '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
        }
        return error.response
    } else if (error.request) {toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
        return error.request
      } else {toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
        return error
      }
  }
  }
  const handleSignOut = () => {tokenBlacklist()}

  if(session){
    return (
      <Box>
        <IconButton
          sx={{
            padding: 0,
          }}
          aria-haspopup="true"
          onClick={handleClick}
          aria-expanded={open ? "true" : undefined}
          aria-controls={open ? "account-menu" : undefined}
        >
          <Avatar alt="Remy Sharp" src="/assets/images/avatars/001-man.svg" />
        </IconButton>
  
        <Menu
          open={open}
          id="account-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1,
              boxShadow: 2,
              minWidth: 200,
              borderRadius: "8px",
              overflow: "visible",
              border: "1px solid",
              borderColor: "grey.200",
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "grey.200",
              },
              "&:before": {
                top: 0,
                right: 14,
                zIndex: 0,
                width: 10,
                height: 10,
                content: '""',
                display: "block",
                position: "absolute",
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
              },
            },
          }}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
        >
          <Box px={2} pt={1}>
            <H6>{session && 'user' in session?session.user['name']:"Anonymous User"}</H6>
            <Small color="grey.500">{session && 'user' in session?session.user['role']==1?"Super Admin":"Admin":"No Role Define"}</Small>
          </Box>
  
          <Divider />
          <Link href={{pathname: '/admin/users/profile'}}>
            <a>
            <MenuItem>Profile</MenuItem>
            </a>
          </Link>
          {/* <MenuItem>Profile</MenuItem> */}
          {/* <MenuItem>My Orders</MenuItem> */}
          {/* <MenuItem>Settings</MenuItem> */}
  
          <Divider />
          <a onClick={handleSignOut}>
          <MenuItem>Logout</MenuItem>
          </a>
        </Menu>
      </Box>
    );
  }

else{
  return (
    <Box>
      <IconButton
        sx={{
          padding: 0,
        }}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
      >
        <Avatar alt="Remy Sharp" src="/assets/images/avatars/001-man.svg" />
      </IconButton>

      <Menu
        open={open}
        id="account-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: "8px",
            overflow: "visible",
            border: "1px solid",
            borderColor: "grey.200",
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "grey.200",
            },
            "&:before": {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: "block",
              position: "absolute",
              borderTop: "1px solid",
              borderLeft: "1px solid",
              borderColor: "grey.200",
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
            },
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
       

        
        <Link href='/login'>
          <a>
          <MenuItem>Login</MenuItem>
          </a>
        </Link>
        <Divider />
        {/* <MenuItem>Profile</MenuItem> */}
        <MenuItem>Settings</MenuItem>

       
        
      </Menu>
    </Box>
  );
}
};

export default AccountPopover;
