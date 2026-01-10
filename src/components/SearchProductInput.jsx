import { Search } from "@mui/icons-material";
import { InputBase, styled } from "@mui/material";
import React from "react"; // styled component

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  fontSize: 14,
  width: "100%",
  maxWidth: 250,
  fontWeight: 500,
  padding: "0 1rem",
  margin: "0 1% 0 0",
  borderRadius: "8px",
  color: theme.palette.grey[600],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
  "::placeholder": {
    color: theme.palette.text.disabled,
  },
}));

const SearchProductInput = (props) => {
  return (
    <StyledInputBase
      startAdornment={
        <Search
          sx={{
            fontSize: 19,
            mr: 1,
          }}
        />
      }
      {...props}
    />
  );
};

export default SearchProductInput;
