// import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
const ItemPriority = ({ bundles,handleBundleSelect }) => {
  // const { id,name,sku,slug,image,mrp,salePrice,bundleType,status } = bundles; // state
  // if(bundles){
  //   bundles['bundles'].map((value)=>{
  //     console.log(value.name);
  //   });
  // }
  const [bundleID, setBundleID] = useState('');
  const handleChange = (event) => {
    console.log(event.target.value);
    setBundleID(event.target.value);
    handleBundleSelect(event.target.value);

  };

  if(bundles){
  return (
    <div>
    <FormControl sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="demo-simple-select-autowidth-label">Select Bundle</InputLabel>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={bundleID}
        onChange={handleChange}
        autoWidth
        label="Select Bundle"
      >
         {bundles['bundles'].map((value)=>(
            <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
          ))}
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Twenty</MenuItem>
        <MenuItem value={21}>Twenty one</MenuItem>
        <MenuItem value={22}>Twenty one and a half</MenuItem> */}
      </Select>
    </FormControl>
  </div>
  );
  }
  else{
    return(
      <></>
    )
  }
};

export default ItemPriority;
