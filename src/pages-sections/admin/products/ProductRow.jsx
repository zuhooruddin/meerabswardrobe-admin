import { Edit } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import { FlexBox } from "components/flex-box";
import { Paragraph, Small } from "components/Typography";
import { useRouter } from "next/router";
import React from "react";
import {server_ip} from "utils/backend_server_ip.jsx"
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; // ========================================================================

// ========================================================================
const ProductRow = ({ product, pageIndex, getCurrentScrollPosition,rowsPerPageRouter }) => {
  const { id,status, name, slug, aliasCode, stock, mrp, salePrice, manufacturer,author,isbn, image } = product; // state
  const imgBaseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL
  const router = useRouter();
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            src={imgBaseUrl+image}
            sx={{
              borderRadius: "8px",
            }}
          />
          <Box>
            <Paragraph>{name}</Paragraph>
            <Small color="grey.600">{aliasCode} {author=="NOT AVAILABLE" || !author?'':'| '+author} {isbn?'| '+isbn:''}</Small><br/>
            <Small color="grey.600"> {slug}</Small>

          </Box>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{manufacturer}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        {salePrice} Rs
      </StyledTableCell>
      <StyledTableCell align="left">
        {stock}
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={() => {
          // router.push(`/admin/products/${id}&${pageIndex}`)
          const currentScrollPosition = getCurrentScrollPosition();
          router.push({
            pathname: `/admin/products/${id}`,
            query: { pageIndexRouter: pageIndex, scrollPosition:currentScrollPosition, rowsPerPageRouter:rowsPerPageRouter },
          })
        }}>
          <Edit />
        </StyledIconButton>

      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ProductRow;
