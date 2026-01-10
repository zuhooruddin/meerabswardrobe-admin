import { Add } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { FlexBox } from "components/flex-box";
import SearchInput from "components/SearchInput";
import Grid from '@mui/material/Grid';
import React from "react"; // ===============================================================

// ===============================================================
const SearchArea = (props) => {
  const { searchPlaceholder, buttonText, handleSearch,searchButton,handleSearchClick,handleClearClick,addButton,searchText } = props;
  const downSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      {/* <FlexBox> */}
      <Grid container spacing={2}>
      <SearchInput placeholder={searchPlaceholder} onChange={handleSearch} value={searchText} />
      <Button color="success" fullWidth={downSM} variant="outlined" onClick={handleSearchClick}>Search</Button>
      <Button color="error" fullWidth={downSM} variant="outlined" onClick={handleClearClick}>Clear</Button>
      {/* </FlexBox> */}
      </Grid>
      {addButton==true?
      <Button
        color="info"
        fullWidth={downSM}
        variant="contained"
        startIcon={<Add />}
        sx={{
          minHeight: 44,
        }}
      >
        {buttonText}
      </Button>
      :''}
    </FlexBox>
  );
};

SearchArea.defaultProps = {
  buttonText: "Add Product",
  searchButton:false,
  addButton:false,
  searchPlaceholder: "Search Product...",
};
export default SearchArea;
