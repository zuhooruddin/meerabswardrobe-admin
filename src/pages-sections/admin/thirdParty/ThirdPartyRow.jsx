import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";
import BazaarSwitch from "components/BazaarSwitch";
import { FlexBox } from "components/flex-box";
import { Paragraph, Small } from "components/Typography";
import currency from "currency.js";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  CategoryWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents"; // ========================================================================

// ========================================================================
const ThirdPartyRow = ({ product, key }) => {
  const { id,name,status } = product; // state
  let statusDisplay = status == 1 ? 'ACTIVE' : 'INACTIVE'

  const router = useRouter();
  // const [productPulish, setProductPublish] = useState(status);
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      {/* <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar
            src={image}
            sx={{
              borderRadius: "8px",
            }}
          />
          <Box>
            <Paragraph>{name}</Paragraph>
            <Small color="grey.600">#{aliasCode}</Small><br/>
            <Small color="grey.600"> {slug}</Small>

          </Box>
        </FlexBox>
      </StyledTableCell> */}
      <StyledTableCell align="left">{id}</StyledTableCell>
      <StyledTableCell align="left">{name}</StyledTableCell>
      <StyledTableCell align="left">
        <CategoryWrapper>{statusDisplay}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={() => router.push(`/admin/third-party/${id}`)}>
          <Edit />
        </StyledIconButton>

        <StyledIconButton>
          <RemoveRedEye />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ThirdPartyRow;
