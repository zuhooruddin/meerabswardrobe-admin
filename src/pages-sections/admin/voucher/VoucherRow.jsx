import { Delete, Edit } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useState } from "react";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; 
import Link from 'next/link'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useRouter } from "next/router";

const VoucherRow = ({ item,  handleDeleteBrand, pageIndex, getCurrentScrollPosition,rowsPerPageRouter }) => {



const imgurl=process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL

const { id,name, code, status,image,discount } = item || {};

  // For Dialog ===================================================
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    handleDeleteBrand(id);
    setOpen(false);
  };
  
  return (
    <StyledTableRow
      tabIndex={-1}
      role="checkbox"
    >
      <StyledTableCell align="left">{name}</StyledTableCell>

      <StyledTableCell align="left">
        {code}
      </StyledTableCell>
      <StyledTableCell align="left">
        {status===1?'Active':'InActive'}
      </StyledTableCell>
     

      <StyledTableCell align="left">
        <Avatar
          src={imgurl+image}
          sx={{
            borderRadius: "8px",
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="left">
        {discount}
      </StyledTableCell>

      <StyledTableCell align="center">
      {/* <Link href={{pathname: '/admin/schools/[id]',query: { id: slug}}}>
        <a>
        <StyledIconButton>
        <Edit />
        </StyledIconButton> 
        </a>
      </Link> */}
      <StyledIconButton onClick={() => {
          router.push({
            pathname: `/admin/voucher/${id}`,
            // query: { pageIndexRouter: pageIndex, scrollPosition:currentScrollPosition, rowsPerPageRouter:rowsPerPageRouter },
          })
        }}>
          <Edit />
        </StyledIconButton>

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
                <b>{name}</b> will be deleted.
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

export default VoucherRow;
