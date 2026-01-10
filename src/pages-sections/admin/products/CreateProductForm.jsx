import { Button, Card, Grid, MenuItem, TextField, Divider, Tab, styled, Box, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup"; // Import Yup for schema validation
import React, { useState } from "react";
import { H4, H3 } from "components/Typography";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";
import 'react-dropdown-tree-select/dist/styles.css'
import Image from 'next/image'
import { server_ip } from "utils/backend_server_ip.jsx"
import DropZone from "components/DropZone";
import CloseIcon from '@mui/icons-material/Close';

import CancelIcon from '@mui/icons-material/Cancel';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTabPanel = styled(TabPanel)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
}));

const StyledTabList = styled(TabList)(({ theme }) => ({
  "& .MuiTab-root.Mui-selected": {
    color: theme.palette.info.main,
  },
  "& .MuiTabs-indicator": {
    background: theme.palette.info.main,
  },
}));


// ================================================================
const CreateProductForm = (props) => {
  const { initialValues,validationSchema, handleFormSubmit, allCategories, imgGallery, disableButtonCheck, itemCategoryList, convertToSlug } = props;
  var disableButton = false
  const imgBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL
  if (disableButtonCheck == true) { disableButton = true }
  const [selectTab, setSelectTab] = useState("image");
  const disabledField = true
  const myLoader = ({ src, width, quality }) => {
    return imgBaseUrl + `${src}`
    // ?w=${width}&q=${quality || 75}
  }


  

 
  
  const [imgsSrc, setImgsSrc] = useState([]);



  const onChangeImage = (e) => {
    setImgsSrc([]);
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImgsSrc((imgs) => [...imgs, reader.result]);
      };
      reader.onerror = () => {
      };
    }
  };
  const [open, setOpen] = useState(false);
  const [alertMessage,setAlertMessage] = useState("");
  const [alertSeverity,setAlertSeverity] = useState("");
  const handleClose = (event, reason) => {if (reason === 'clickaway') {return;}setOpen(false);};
  return (
    <Card
      sx={{
        p: 6,
      }}
    >
         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Formik
  
        initialValues={initialValues}
        validationSchema={validationSchema} 
        onSubmit={handleFormSubmit}
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

            <Grid item sm={12} xs={4}>
                <H3 style={{marginBottom:'2%'}}>
                  Editable Fields
                </H3>
            </Grid>
            <TabContext value={selectTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "grey.300",
                }}
              >
                <StyledTabList
                  onChange={(_, value) => setSelectTab(value)}
                  variant="scrollable"
                >
                  <Tab label="General" value="image"  />
                  <Tab label="Categories" value="categories" disableRipple />
                  <Tab label="Featured / New" value="new-arrival" disableRipple />
                  {/* <Tab label="Update Slug" value="slug" disableRipple /> */}
                  {/* <Tab label="Tags" value="tags" disableRipple /> */}
                  <Tab label="Social Links" value="social-links" disableRipple />
                  <Tab label="SEO" value="seo" disableRipple />
                  <Tab label="Gallery Images" value="gallery-images"  />
                  <Tab label="Stock" value="stock" disableRipple />
                </StyledTabList>
              </Box>

              <Grid item sm={12} xs={4}>
  <H3 style={{ marginBottom: '2%' }}>Editable Fields</H3>
</Grid>
<StyledTabPanel value="image">

      <Grid item xs={12}>
      {/* <DropZone onChange={(files) => setFieldValue('image', files[0])} /> */}

      {/* <input
  type="file"
  onChange={(e) => setFieldValue('image', e.target.files[0])}
/> */}

<DropZone
            onChange={(files) => {
              setFieldValue('image', files[0]);
            }}
            title="Drag & Drop  Logo"
          />
          <br /><br />
          {values.image && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(values.image)}
                alt="Selected  logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('image', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}

{/* <div> */}
{/* <input
  onChange={(event) => {
    setFieldValue("image", event.target.files[0]);
    onChangeImages(event);
  }}
  type="file"
  name="file"
/> */}

      {/* <input
        onChange={onChangeImages}
        type="file"
        name="file"
      /> */}

      {/* {selectedFile && (
        <div>
          <p>Selected Image:</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px' }}
            />
            <IconButton onClick={handleRemoveImage}>
              <CancelIcon />
            </IconButton>
          </div>
        </div>
      )} */}
    {/* </div> */}

    
      </Grid>

  


<Grid container spacing={2}>
            <Grid item xs={12}>
                <Divider sx={{my: 4,}}/>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                //   disabled={disabledField}
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
              <Grid item sm={6} xs={12}>
                <TextField
                //   disabled={disabledField}
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
                      fullWidth
                      name="slug"
                      label="Slug"
                      color="info"
                      size="medium"
                      placeholder="Slug"
                      value={values.slug}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
              <Grid item sm={12} xs={12}>
                <TextField
                //   disabled={disabledField}
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
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <H4>Measurements</H4>
                </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="length"
                  label="Length"
                  color="info"
                  size="medium"
                  placeholder="Length"
                  value={values.length}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.length && !!errors.length}
                  helperText={touched.length && errors.length}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="height"
                  label="Height"
                  color="info"
                  size="medium"
                  placeholder="Height"
                  value={values.height}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.height && !!errors.height}
                  helperText={touched.height && errors.height}
                />
              </Grid>

              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="weight"
                  label="Weight"
                  color="info"
                  size="medium"
                  placeholder="Weight"
                  value={values.weight}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.weight && !!errors.weight}
                  helperText={touched.weight && errors.weight}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="width"
                  label="Width"
                  color="info"
                  size="medium"
                  placeholder="Width"
                  value={values.width}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.width && !!errors.width}
                  helperText={touched.width && errors.width}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
              <H4>Price Detail</H4>
            </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="mrp"
                  label="Regular Price"
                  color="info"
                  size="medium"
                  placeholder="Regular Price"
                  value={values.mrp}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.mrp && !!errors.mrp}
                  helperText={touched.mrp && errors.mrp}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="salePrice"
                  label="Sale Price"
                  color="info"
                  size="medium"
                  placeholder="Sale Price"
                  value={values.salePrice}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.salePrice && !!errors.salePrice}
                  helperText={touched.salePrice && errors.salePrice}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="discount"
                  label="Discount"
                  color="info"
                  size="medium"
                  placeholder="Discount"
                  value={values.discount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.discount && !!errors.discount}
                  helperText={touched.discount && errors.discount}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <H4>External Parties</H4>
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="author"
                  label="Author"
                  color="info"
                  size="medium"
                  placeholder="Author"
                  value={values.author}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.author && !!errors.author}
                  helperText={touched.author && errors.author}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                // disabled={disabledField}
                  fullWidth
                  name="manufacturer"
                  label="Manufacturer"
                  color="info"
                  size="medium"
                  placeholder="Manufacturer"
                  value={values.manufacturer || null}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.manufacturer && !!errors.manufacturer}
                  helperText={touched.manufacturer && errors.manufacturer}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
  <TextField
    fullWidth
    name="isbn"
    label="ISBN"
    color="info"
    size="medium"
    placeholder="ISBN"
    value={values.isbn}
    onBlur={handleBlur}
    onChange={handleChange}
    error={!!touched.isbn && !!errors.isbn}
    helperText={touched.isbn && errors.isbn}
  />
</Grid>
 
            </Grid>
</StyledTabPanel>




              <StyledTabPanel value="categories">
              <Autocomplete
                multiple
                defaultValue={allCategories.filter(ob => itemCategoryList && itemCategoryList.includes(ob.id))}
                name="category"
                options={allCategories}
                onChange = {(e,value) => setFieldValue("category", value)}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.id}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField onChange={handleChange} {...params} label="Select Categories" placeholder="Category" />
                )}
              />
              </StyledTabPanel>

              <StyledTabPanel value="new-arrival">
              <Grid container spacing={3}>
              <Grid item xs={12}>
                  <H4>New Arrival Details</H4>
              </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    select
                    fullWidth
                    name="isNewArrival"
                    label="is New Arrival"
                    color="info"
                    size="medium"
                    placeholder="is New Arrival"
                    value={values.isNewArrival}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.isNewArrival && !!errors.isNewArrival}
                    helperText={touched.isNewArrival && errors.isNewArrival}
                  >
                    <MenuItem value='1'><b>Yes</b></MenuItem>
                    <MenuItem value='0'><b>No</b></MenuItem>
                  </TextField>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                      fullWidth
                      name="newArrivalTill"
                      // label="New Arrival Till"
                      color="info"
                      type="date"
                      size="medium"
                      placeholder="New Arrival Till"
                      value={values.newArrivalTill}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!touched.newArrivalTill && !!errors.newArrivalTill}
                      helperText={touched.newArrivalTill && errors.newArrivalTill}
                  />
                </Grid>
                <Grid item xs={12}>
                  <H4>Is Featured</H4>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <TextField
                    select
                    fullWidth
                    name="isFeatured"
                    label="is Featured"
                    color="info"
                    size="medium"
                    placeholder="is Featured"
                    value={values.isFeatured}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.isFeatured && !!errors.isFeatured}
                    helperText={touched.isFeatured && errors.isFeatured}
                  >
                    <MenuItem value='1'><b>Yes</b></MenuItem>
                    <MenuItem value='0'><b>No</b></MenuItem>
                  </TextField>
                </Grid>

              </Grid>
              </StyledTabPanel>
            

              {/* <StyledTabPanel value="tags">
              <Grid container spacing={2}>
                
                <FieldArray
                  name="tags"
                  render={(arrayHelper) => (
                    <Fragment>
                      <Grid item xs={12}>
                        <FlexBox alignItems="center" justifyContent="space-between">
                          <H4>Product Tags</H4>

                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              arrayHelper.push({
                                id: Date.now(),
                                name: "",
                              });
                            }}
                          >
                            Add Item
                          </Button>
                        </FlexBox>
                      </Grid>

                      {values.tags?.map((item, index) => (
                        <Grid item container spacing={2} key={item.id}>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              color="info"
                              size="medium"
                              label="Name"
                              value={item.name}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name={`tags.${index}.name`}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton onClick={() => arrayHelper.remove(index)}>
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                    </Fragment>
                  )}
                />
              </Grid>
              </StyledTabPanel> */}

              <StyledTabPanel value="social-links">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <H4>Social Links</H4>
                </Grid>

                <Grid item md={6} xs={12}>
                {/* <InputMask mask="https://f\acebook.com/********" value={values.facebook_link} onChange={onChange}>
                {
                   inputProps => ( */}
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="facebook_link"
                    label="Facebook"
                    value={values.facebook_link}
                    onChange={handleChange}
                    placeholder="https://facebook.com"
                    InputProps={{
                      startAdornment: (
                        <Facebook
                          fontSize="small"
                          color="info"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                   {/* )}
                </InputMask> */}
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="twitter_link"
                    label="Twitter"
                    value={values.twitter_link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    InputProps={{
                      startAdornment: (
                        <Twitter
                          fontSize="small"
                          color="info"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="instagram_link"
                    label="Instagram"
                    onChange={handleChange}
                    value={values.instagram_link}
                    placeholder="https://example.com"
                    InputProps={{
                      startAdornment: (
                        <Instagram
                          fontSize="small"
                          color="secondary"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="youtube_link"
                    label="Youtube"
                    value={values.youtube_link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    InputProps={{
                      startAdornment: (
                        <YouTube
                          fontSize="small"
                          color="error"
                          sx={{
                            mr: 1,
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              </StyledTabPanel>

              <StyledTabPanel value="seo">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <H4>Product SEO</H4>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="metaUrl"
                    label="Meta URL"
                    value={values.metaUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="metaTitle"
                    label="Meta Title"
                    value={values.metaTitle}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    color="info"
                    size="medium"
                    name="metaDescription"
                    label="Meta Description"
                    onChange={handleChange}
                    value={values.metaDescription}
                    placeholder="Description"
                  />
                </Grid>
              </Grid>
              </StyledTabPanel>

              <StyledTabPanel value="gallery-images">
                <input onChange={(event) => {
                    setFieldValue("galleryFile", event.currentTarget.files);
                    onChangeImage(event);
                }} type="file" name="file" multiple />
                {imgsSrc.map((link) => (
                    <Image key={link} src={link} width={100} height={100} alt="Product Image" />
                ))}
              
             
                
              </StyledTabPanel>

              <StyledTabPanel value="stock">
              <Grid container spacing={3}>
                
                <Grid item md={6} xs={12}>
                  <TextField
                //   disabled={disabledField}
                    fullWidth
                    color="info"
                    size="medium"
                    name="stock"
                    label="Stock"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stock}
                    error={!!touched.stock && !!errors.stock}
                    helperText={touched.stock && errors.stock}
                  />
                </Grid>
              </Grid>
              </StyledTabPanel>
              
            </TabContext>

          
            
        <Grid item sm={6} xs={12}>
          <Divider sx={{my: 4,}}/>
          {/* <Button variant="contained" color="info" type="submit">
            Save product
          </Button> */}
          <Button   disabled={disableButton}
          onClick={() =>{
            
            if(errors.stock || errors.name || errors.isFeatured || errors.slug || errors.mrp || errors.salePrice || errors.sku || errors.description || errors. isNewArrival || errors.newArrivalTill ){
                setAlertSeverity('error');
                setAlertMessage('Fill all the required  fields.');
                setOpen(true);
                return false;
              }
          }}
          variant="contained" color="info" type="submit" 
          >
            Save product
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default CreateProductForm;
