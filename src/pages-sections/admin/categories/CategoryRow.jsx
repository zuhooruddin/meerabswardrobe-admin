import { Delete, Edit } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
// ========================================================================
const CategoryRow = ({ item, selected,handleDeleteCategory, pageIndex, getCurrentScrollPosition,rowsPerPageRouter }) => {
  const imgBaseUrl = server_ip;
  const { id,slug,extPosId, name,parentId, icon, showAtHome } = item;
  const router = useRouter();
  const [showAtHomeCategory, setshowAtHomeCategory] = useState(showAtHome);
  
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
      handleDeleteCategory(id);
      setOpen(false);
    };

  return (
    <StyledTableRow
      tabIndex={-1}
      role="checkbox"
    >
      <StyledTableCell align="left">{name}</StyledTableCell>

      <StyledTableCell align="left">
        {slug}
      </StyledTableCell>

      <StyledTableCell align="left">
        <Avatar
          src={icon}
          sx={{
            borderRadius: "8px",
          }}
        />
      </StyledTableCell>

      <StyledTableCell align="left">{parentId?parentId['name']:"NO PARENT AVAILABLE"}</StyledTableCell>

      <StyledTableCell align="center">
      {/* <Link href={{pathname: `/admin/categories/${slug}`}}>
        <a>
        <StyledIconButton>
        <Edit />
        </StyledIconButton> 
        </a>
      </Link> */}
        <StyledIconButton onClick={() => {
            const currentScrollPosition = getCurrentScrollPosition();
            router.push({
              pathname: `/admin/categories/${slug}`,
              query: { pageIndexRouter: pageIndex, scrollPosition:currentScrollPosition, rowsPerPageRouter:rowsPerPageRouter },
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

export default CategoryRow;
