import { Delete, Edit } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { Paragraph } from "components/Typography";
import React, {useState} from "react";
import api from "utils/api/dashboard";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import {server_ip} from "utils/backend_server_ip.jsx"
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; // ========================================================================
import Link from 'next/link'
// For Confirmation Dialog ======================================
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {useSession} from 'next-auth/react';

// ========================================================================
async function deleteUser(values,router,session){
  await api.deleteAdmin(values,session.accessToken).then((response) => {
    if(response.data['ErrorCode']==1){
      toast.error(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else{
      toast.success(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
      router.push('/admin/users');
    }
    return response.data
  }).catch((error) => {
    if (error.response) {
      //// if api not found or server responded with some error codes e.g. 404
      toast.error('Error Occured', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error.response
    } else if (error.request) {
      /// Network error api call not reached on server
      toast.error('Network Error', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error.request
    } else {
      toast.error('Error Occured', {
        position: toast.POSITION.TOP_RIGHT
      });
      return error
    }
  });
}

const AdminRow = ({ customer }) => {
  const { data: session,status} = useSession();
  const router = useRouter();
  const { id,email, name, mobile, profile_pic, orders, role, handleDeleteAdmin } = customer;
  const imgBaseUrl = server_ip+'media/';
  // For Dialog ===================================================
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    deleteUser(id,router,session);
    setOpen(false);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar src={imgBaseUrl+profile_pic} sx={{}} />
          <Paragraph>{name}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {mobile?mobile:'Nil'}
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {email}
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {role==1?'Super Admin':role==2?'Admin':'Customer'}
      </StyledTableCell>

      <StyledTableCell align="center">
        <Link href={{pathname: '/admin/users/[id]',query: { id: id}}}>
          <a>
          <StyledIconButton>
          <Edit />
          </StyledIconButton> 
          </a>
        </Link>

        <StyledIconButton>
          <Delete onClick={handleClickOpen} />
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Do you really want to delete?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <b>{name}</b> with email: <b>{email}</b> will no longer be able to login Admin Portal.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                NO
              </Button>
              <Button onClick={handleDelete} autoFocus>
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default AdminRow;
