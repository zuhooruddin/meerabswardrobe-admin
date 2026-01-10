import { Delete, Edit } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { Paragraph, Small } from "components/Typography";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; // ========================================================================

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
const BundleRow = ({ bundles,handleDeleteBundle, pageIndex, getCurrentScrollPosition,rowsPerPageRouter }) => {
  const { id,name,sku,slug,image,mrp,salePrice,bundleType,status } = bundles; // state
  
  const router = useRouter();
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
    handleDeleteBundle(id);
    setOpen(false);

  };
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            src={image}
            sx={{
              borderRadius: "8px",
            }}
          />
          <Box>
            <Paragraph>{name}</Paragraph>
            <Small color="grey.600">SKU - {sku}</Small><br/>
          </Box>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        {bundleType}
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{mrp}</CategoryWrapper>
      </StyledTableCell>
      <StyledTableCell align="left">
        <CategoryWrapper>{salePrice}</CategoryWrapper>
      </StyledTableCell>
      <StyledTableCell align="left">
        <CategoryWrapper>{parseInt(status)==1?'ACTIVE':parseInt(status)==2?'INACTIVE':'DELETED'}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        {/* <StyledIconButton onClick={() => router.push(`/admin/bundles/${slug}`)}>
          <Edit />
        </StyledIconButton> */}
        <StyledIconButton onClick={() => {
          const currentScrollPosition = getCurrentScrollPosition();
          router.push({
            pathname: `/admin/bundles/${slug}`,
            query: { pageIndexRouter: pageIndex, scrollPosition:currentScrollPosition, rowsPerPageRouter:rowsPerPageRouter },
          })
        }}>
          <Edit />
        </StyledIconButton>

        <StyledIconButton>
          <Delete onClick={handleClickOpen}/>
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
                <b>{name}</b> with sku: <b>{sku}</b> will be deleted.
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

export default BundleRow;
