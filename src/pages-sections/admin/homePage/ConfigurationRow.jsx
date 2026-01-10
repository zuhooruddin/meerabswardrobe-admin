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


const ConfigurationRow = ({item}) => {
  const {id, name, value, location, priority} = item;
  
  return (
    <StyledTableRow
      tabIndex={-1}
      role="checkbox">
      <StyledTableCell align="left">
        {name}
      </StyledTableCell>

      <StyledTableCell align="left">
        {value}
      </StyledTableCell>

      <StyledTableCell align="left">
        {location}
      </StyledTableCell>

      <StyledTableCell align="left">
        {priority}
      </StyledTableCell>

      <StyledTableCell align="center">
      <Link href={{pathname: `/admin/homePage/${id}`}}>
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

export default ConfigurationRow;
