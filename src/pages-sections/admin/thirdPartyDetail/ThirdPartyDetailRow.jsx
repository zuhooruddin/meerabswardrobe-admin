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
const ThirdPartyDetailRow = ({ product }) => {
  const { id,thirdPartyId,name,image,slug,thirdPartyId__name,discountType,discount,showAtHome } = product; // state

  const router = useRouter();
  // const [productPulish, setProductPublish] = useState(status);
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
            <Small color="grey.600">#{id}</Small><br/>
          </Box>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        {slug}
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{thirdPartyId__name}</CategoryWrapper>
      </StyledTableCell>

      {/* <StyledTableCell align="left">
        <Avatar
          src={image}
          sx={{
            width: 55,
            height: "auto",
            borderRadius: 0,
          }}
        />
      </StyledTableCell> */}


      {/* <StyledTableCell align="left">
        <BazaarSwitch
          color="info"
          checked={productPulish}
          onChange={() => setProductPublish((state) => !state)}
        />
      </StyledTableCell> */}

      <StyledTableCell align="center">
        <StyledIconButton onClick={() => router.push(`/admin/third-party/detail/${slug}`)}>
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

export default ThirdPartyDetailRow;
