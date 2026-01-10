import { Button, Card, Grid, MenuItem, TextField,Divider,Box,IconButton } from "@mui/material";
import { FieldArray,Formik } from "formik";
import React, { useState,Fragment } from "react";
import { H4 } from "components/Typography";
import Autocomplete from '@mui/material/Autocomplete';
import {server_ip} from "utils/backend_server_ip.jsx"
import Image from 'next/image'

// For Check Boxes
import { Delete } from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ================================================================
const BundleForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, handleProductSelectedChange,productList,brandList, ProductSelected,brandDisabled,BundleType, setBundleProduct, BundleProduct, handleBundleProductChange,Price,SalePrice,setbrandSelected,brandSelected,setBundleType,updateHeading,disableButtonCheck,convertToSlug,setSearch,setSearchText,searchText,setUseSwrFlag,loadMoreResults,setPageIndex,listElem,setScrollPosition } = props;
  const imageBaseUrl = server_ip+'media/';
  const imgBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'
  var disableButton = false
  if(disableButtonCheck==true){disableButton=true}
  var bundleHeading = "Add Bundle"
  if(updateHeading){bundleHeading=updateHeading}
  const myLoader = ({ src, width, quality }) => {
    return server_ip+`media/${src}?w=${width}&q=${quality || 75}`
  }
  const myLoaderDropdown = ({ src, width, quality }) => {
    return imgBaseUrl+`${src}?w=${width}&q=${quality || 75}`
  }
  // Alert Message 
  const [open, setOpen] = useState(false);
  const [alertMessage,setAlertMessage] = useState("");
  const [alertSeverity,setAlertSeverity] = useState("");
  const handleClose = (event, reason) => {if (reason === 'clickaway') {return;}setOpen(false);};
  // Alert Message End 

  const defaultProps = {
    options: (productList.filter(({ id: id1 }) => !BundleProduct.some(({ id: id2 }) => id1 === id2))),
    getOptionLabel: (option) => option.name,
  };
  const disabledField = false
  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      {/* For Alert Show  */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <H4>{bundleHeading}</H4>
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  disabled={disabledField}
                  fullWidth
                  name="name"
                  label="Name"
                  color="info"
                  size="medium"
                  placeholder="Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={(event, value) => {setFieldValue('name', event.target.value);setFieldValue('slug', convertToSlug(event.target.value)); }}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="slug"
                  label="Slug"
                  color="info"
                  size="medium"
                  placeholder="Slug"
                  value={values.slug}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.slug && !!errors.slug}
                  helperText={touched.slug && errors.slug}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="sku"
                  label="Sku"
                  color="info"
                  size="medium"
                  placeholder="Sku"
                  value={values.sku}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.sku && !!errors.sku}
                  helperText={touched.sku && errors.sku}
                />
              </Grid>
              
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="bundleType"
                  onBlur={handleBlur}
                  value={BundleType}
                  placeholder="Bundle Type"
                  onChange={(event, value) => {setBundleType(value.props['value']);setFieldValue('bundleType', value.props['value']); } }
                  label="Select Bundle Type"
                  error={!!touched.bundleType && !!errors.bundleType}
                  helperText={touched.bundleType && errors.bundleType}
                >
                  <MenuItem value="BRAND">Brand Bundle</MenuItem>
                  <MenuItem value="PRODUCT">Product Bundle</MenuItem>
                  
                </TextField>
              </Grid>
              <Grid item sm={6} xs={12}>
              <TextField
                  select
                  fullWidth
                  disabled={brandDisabled}
                  color="info"
                  size="medium"
                  name="brand"
                  onBlur={handleBlur}
                  placeholder="brand"
                  onChange = {(event, value) => {setbrandSelected(value.props.value);setFieldValue('brand', value.props['value']); }}
                  value={brandSelected}
                  label="Select Brand"
                  error={!!touched.brand && !!errors.brand}
                  helperText={touched.brand && errors.brand}
                >
                  {brandList.map(brand =>{
                    return(<MenuItem key={brand['id']} value={brand['id']}>{brand['name']}</MenuItem>)
                  })}
                </TextField>
              </Grid>

              <Grid item container sm={12} xs={12} spacing={3}>
                <FieldArray
                  name="product"
                  render={(arrayHelper) => (
                    <Fragment>
                      <Grid item container >
                      <Grid item xs={8}>

                         <Autocomplete
                            {...defaultProps}
                            id="product"
                            openOnFocus={true}
                            value={ProductSelected || null}
                            onChange={(event, newValue) => {
                              handleProductSelectedChange(newValue);
                            }}
                            onKeyUp={(event,newValue) => {
                              event.defaultMuiPrevented = true;
                              setSearchText(event.target.value);
                            }}
                            
                            ListboxProps={{
                              ref: listElem,
                              onScroll: (event) => {
                                const listboxNode = event.currentTarget;
                                const position = listboxNode.scrollTop + listboxNode.clientHeight;
                                if (listboxNode.scrollHeight - position <= 1) {
                                  setScrollPosition(position);
                                  loadMoreResults();
                                }
                              }
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Product" variant="standard" />
                            )}
                            renderOption={(props, option) => (
                              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                <Image
                                  loader={myLoaderDropdown}
                                  width="50"
                                  height="40"
                                  src={option.image}
                                  // srcSet={`${option.image} 2x`}
                                  alt="product image"
                                />
                                 ({option.sku}) {option.name}
                              </Box>
                            )}
                          />
                          </Grid>
                      <Grid item xs={1}>
                        <IconButton padding={2} onClick={() => {
                            setScrollPosition(0);
                            setPageIndex(1);
                            setSearch(searchText);
                            setUseSwrFlag(true);
                            setSearchText('');
                            document.getElementById("product").focus();                            
                            }
                            }>
                            <SearchIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={2}>

                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              if(ProductSelected){
                              setScrollPosition(0);
                              setPageIndex(1);
                              setSearch('');
                              arrayHelper.push({
                                id: ProductSelected['id'],
                                name: ProductSelected['name'],
                                quantity: 1,
                                price: ProductSelected['mrp'],
                              });
                              ProductSelected['quantity'] = 1;
                              handleBundleProductChange(ProductSelected);
                              handleProductSelectedChange(null);                              
                            }
                            }}
                          >
                            Add Item
                          </Button>
                          </Grid>
                      </Grid>

                      {values.product?.map((item, index) => (
                        <Grid item container spacing={2} key={item.id}>
                          <Grid item xs={5}>
                            <TextField InputProps={{readOnly: true}}                              
                              fullWidth
                              color="info"
                              size="small"
                              label="Product Name"
                              value={item.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name={`product.${index}.parent`}
                            />
                          </Grid>

                          <Grid item xs={5}>
                            <TextField 
                              inputProps={{ min: 1 }}
                              fullWidth
                              color="info"
                              type="number"
                              size="small"
                              label="Quantity"
                              defaultValue={item.quantity}
                              onBlur={handleBlur}
                              onChange={(event, value) => {
                                let newArr = [...BundleProduct]
                                newArr[index]['quantity'] = parseInt(event.target.value);
                                setBundleProduct(newArr);
                              }}
                              name={`quantity.${index}.child`}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <IconButton padding={2} onClick={() => {
                              setBundleProduct((prevList) =>  prevList.filter((filteredItem) => filteredItem.id !== item.id));
                              arrayHelper.remove(index);
                            }
                            }>
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                    </Fragment>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item sm={6} xs={12}>
                <TextField
                inputProps={{
                  readOnly: true,
                }}
                  fullWidth
                  name="price"
                  label="Price"
                  color="info"
                  size="medium"
                  type="number"
                  placeholder="Price"
                  value={Price}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                inputProps={{
                  readOnly: true,
                }}
                  fullWidth
                  name="salePrice"
                  label="Sale Price"
                  color="info"
                  size="medium"
                  type="number"
                  placeholder="Sale Price"
                  value={SalePrice}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.salePrice && !!errors.salePrice}
                  helperText={touched.salePrice && errors.salePrice}
                />
              </Grid>
                
                <Grid item sm={12} xs={12}>
                <TextField
                  rows={6}
                  multiline
                  fullWidth
                  color="info"
                  size="medium"
                  name="description"
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Description"
                  value={values.description}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
                </Grid>
                <Grid item xs={12}>
                  <input id="file" accept="image/jpeg,image/png,image/gif" name="file" type="file" onChange={(event) => {
                    setFieldValue("imageFile", event.currentTarget.files[0]);
                  }} />
                  <Image
                    loader={myLoader}
                    src={values.image}
                    alt="brand Image"
                    width={200}
                    height={200}
                  />
                </Grid>
                
            </Grid>
        <Grid item sm={6} xs={12}>
          <Divider sx={{my: 4,}}/>
          <Button   disabled={disableButton}
          onClick={() =>{
              if(!errors.name && !errors.sku  && !errors.description){
                if(BundleType){
                  if(BundleType=="BRAND" && brandSelected || BundleType=="PRODUCT"){
                    if(values.product){
                      if(Object.keys(values.product).length > 0){
                        return true;
                      }
                      else{
                        setAlertSeverity('error');
                        setAlertMessage('No Products Selected! Select Product to create Bundle.');
                        setOpen(true);
                        return false;
                      }
                    }
                    else{
                      setAlertSeverity('error');
                      setAlertMessage('No Products Selected! Select Product to create Bundle.');
                      setOpen(true);
                      return false;
                    }
                  }
                  else{
                    setAlertSeverity('error');
                    setAlertMessage('Invalid Field! Select BRAND.');
                    setOpen(true);
                    return false;
                  }
                }
                else{
                  setAlertSeverity('error');
                  setAlertMessage('Invalid Field! Select Bundle Type.');
                  setOpen(true);
                  return false;
                }
              }
              else{
                setAlertSeverity('error');
                setAlertMessage('Fill all the blank fields.');
                setOpen(true);
                return false;
              }
          }}
          variant="contained" color="info" type="submit" 
          >
            Save Details
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
        
    </Card>
  );
};

export default BundleForm;
