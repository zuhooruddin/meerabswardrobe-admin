import { Edit } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/router";
import React from "react";
import {
  StatusWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; // ========================================================================

// ========================================================================
const OrderRow = ({ order, pageIndex, getCurrentScrollPosition,rowsPerPageRouter }) => {
  const { totalBill, id, orderNo, totalItems, timestamp, shippingAddress, status,paymentMethod,paymentstatus} = order;
  const dateFormat = new Date(timestamp);
  var date = dateFormat.getDate()+
           "/"+(dateFormat.getMonth()+1)+
           "/"+dateFormat.getFullYear()+
           " "+dateFormat.getHours()+
           ":"+dateFormat.getMinutes()+
           ":"+dateFormat.getSeconds();
  
  const router = useRouter();
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">{orderNo}</StyledTableCell>
      <StyledTableCell align="left">{totalItems}</StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {date}
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {shippingAddress}
      </StyledTableCell>

      <StyledTableCell align="left">
        Rs. {totalBill}
      </StyledTableCell>
      <StyledTableCell align="left">
     {paymentMethod
}
      </StyledTableCell>
      <StyledTableCell align="left">
     {paymentstatus&&paymentstatus?paymentstatus:'COD'
}
      </StyledTableCell>
      <StyledTableCell align="left">
        <StatusWrapper status={status}>{status=="PENDING"?"SENT TO POS":status}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        {/* {status=="UNCONFIRMED"? */}
        <StyledIconButton onClick={() => {
          // router.push(`/admin/orders/${orderNo}`)
          const currentScrollPosition = getCurrentScrollPosition();
          router.push({
            pathname: `/admin/orders/${orderNo}`,
            query: { pageIndexRouter: pageIndex, scrollPosition:currentScrollPosition, rowsPerPageRouter:rowsPerPageRouter },
          })
          }}>
        {status=="UNCONFIRMED"?<Edit />:<VisibilityIcon />}
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default OrderRow;
