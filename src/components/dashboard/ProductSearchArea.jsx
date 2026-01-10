import { Add } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { FlexBox } from "components/flex-box";
import SearchProductInput from "components/SearchProductInput";
import Grid from '@mui/material/Grid';
import React from "react"; // ===============================================================

// ===============================================================
const ProductSearchArea = (props) => {
  const { searchPlaceholder, buttonText, handleSearch,handleSearchAuthor,handleSearchManufacturer,searchButton,handleSearchClick,handleClearClick,addButton,searchText,authorPlaceholder,manufacturerPlaceholder } = props;
  const downSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      {/* <FlexBox> */}
      <Grid container spacing={2}>
      <SearchProductInput placeholder={searchPlaceholder}       onChange={handleSearch} value={searchText} />
      <SearchProductInput placeholder={authorPlaceholder}       onChange={handleSearchAuthor} value={props.searchAuthorText} />
      <SearchProductInput placeholder={manufacturerPlaceholder} onChange={handleSearchManufacturer} value={props.searchManufacturerText} />
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

ProductSearchArea.defaultProps = {
  buttonText: "Add Product",
  searchButton:false,
  addButton:false,
  searchPlaceholder: "Search Product...",
};
export default ProductSearchArea;
