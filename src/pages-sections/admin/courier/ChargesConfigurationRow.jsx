import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
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
import Button from '@mui/material/Button';


const ChargesConfigurationRow = ({item}) => {
  const {id, courier, cityType, weight, price, addOn, status} = item;
  
  return (
    <StyledTableRow
      tabIndex={-1}
      role="checkbox">
      <StyledTableCell align="left">
        {courier['name']}
      </StyledTableCell>

      <StyledTableCell align="left">
        {cityType}
      </StyledTableCell>

      <StyledTableCell align="left">
        {weight}
      </StyledTableCell>

      <StyledTableCell align="left">
        {price}
      </StyledTableCell>

      <StyledTableCell align="left">
        {addOn==false?"FALSE":'TRUE'}
      </StyledTableCell>

      <StyledTableCell align="left">
        {status}
      </StyledTableCell>

      <StyledTableCell align="center">
      <Link href={{pathname: `/admin/courier/charges/${id}`}}>
        <a>
        <StyledIconButton>
        <Edit />
        </StyledIconButton> 
        </a>
      </Link>
      </StyledTableCell>
      
    </StyledTableRow>
  );
};

export default ChargesConfigurationRow;
