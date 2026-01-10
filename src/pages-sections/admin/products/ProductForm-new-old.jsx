import { Button, Card, Grid, MenuItem, TextField,Divider,Tab,styled,Box,IconButton } from "@mui/material";
import DropZone from "components/DropZone";
import { FieldArray,Formik } from "formik";
import React, { useState, useEffect  , Fragment }  from "react";
import { H4, Paragraph } from "components/Typography";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import {ImageForm} from "pages-sections/admin";
import {TagForm} from "pages-sections/admin";
import {SocialLinksForm} from "pages-sections/admin";
import {SeoForm} from "pages-sections/admin";
import {GalleryForm} from "pages-sections/admin";
import {StockForm} from "pages-sections/admin";

import { MultiSelectDropdown } from "pages-sections/admin";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { FlexBox } from "components/flex-box";
import { Delete } from "@mui/icons-material";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'



const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
const ProductForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, parentCategories, subCategories, navCategories } = props;
  const [subCatList, setsubCatList] = useState([]);
  // console.log(subCatCopy);
  const [parentSelected, setparentSelected] = useState([]);
  
  const handleParentCategoryChange = (option) =>{
    // console.log(option.id);
    const dt = subCategories.filter(x => x.parentId === option.id);
    setsubCatList(dt)
    setparentSelected({'id':option.id,'name':option.name})
  };

  const [subSelected, setsubSelected] = useState([]);
  // useEffect(()=>{
  //   console.log('useState Sub Change');
  //   console.log(subSelected);
  // })
  // function onParentChange(option) {
  //   console.log(option);
  //   setparentSelected(option.id);
  //   console.log(parentSelected);
  //   console.log(parentSelected);
  // }
  
  const [selectTab, setSelectTab] = useState("image");
  const disabledField = false

/// tree Dropdown
  const data = {
    label: 'search me',
    value: 'searchme',
    children: [
      {
        label: 'search me too',
        value: 'searchmetoo',
        children: [
          {
            label: 'No one can get me',
            value: 'anonymous',
          },
        ],
      },
    ],
  }
  
  const onChange = (currentNode, selectedNodes) => {
    console.log('onChange::', currentNode, selectedNodes)
  }
  const onAction = (node, action) => {
    console.log('onAction::', action, node)
  }
  const onNodeToggle = currentNode => {
    console.log('onNodeToggle::', currentNode)
  }
  /// Tree Dropdown End

  return (
    <Card
      sx={{
        p: 6,
      }}
    >
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        // validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <H4>Product Detail</H4>
              </Grid>
              {/* <Grid item sm={12} xs={12}>
                <DropdownTreeSelect data={navCategories}  texts={{ placeholder: "Select Category" }} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} />
              </Grid> */}
              {/* <Grid container spacing={3}>
                <FieldArray
                  name="parentCat"
                  render={(arrayHelper) => (
                    <Fragment>
                      <Grid item sm={4} xs={12}>
                        <Autocomplete
                          id="parentCategory"
                          freeSolo
                          options={parentCategories}
                          disableClearable
                          noOptionsText='No Parent Category Available'
                          onChange={(event, value) => handleParentCategoryChange(value)}
                          getOptionSelected={(option, value) => option.name === value.id}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} label="Parent Category" />}
                        />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                        <Autocomplete
                          id="subCategory"
                          freeSolo
                          options={subCatList}
                          disableClearable
                          noOptionsText='No Sub Category Available'
                          onChange={(event, value) => setsubSelected({'id':value.id,'name':value.name})}
                          getOptionSelected={(option, value) => option.name === value.id}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} label="Sub Category" />}
                        />
                        </Grid>
                      <Grid item sm={4} xs={12}>
                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              if(parentSelected!= '' && subSelected!= ''){
                              arrayHelper.push({
                                id: Date.now(),
                                parent: parentSelected.name,
                                child: subSelected.name,
                              });
                            }
                            }}
                          >
                            Add Item
                          </Button>
                      </Grid>

                      {values.parentCat?.map((item, index) => (
                        <Grid item container spacing={2} key={item.id}>
                          <Grid item xs={5}>
                            <TextField InputProps={{readOnly: true}}                              
                              fullWidth
                              color="info"
                              size="small"
                              label="Parent Category"
                              value={item.parent}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name={`parentCat.${index}.parent`}
                            />
                          </Grid>

                          <Grid item xs={5}>
                            <TextField InputProps={{readOnly: true}}
                              fullWidth
                              color="info"
                              size="small"
                              label="Sub Category"
                              value={item.child}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              name={`parentCat.${index}.child`}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <IconButton padding={2} onClick={() => arrayHelper.remove(index)}>
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                    </Fragment>
                  )}
                />
              </Grid> */}
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
                  onChange={handleChange}
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
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <H4>Measurements</H4>
                </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="length"
                  label="Length"
                  color="info"
                  size="medium"
                  placeholder="Length"
                  value={values.length}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="height"
                  label="Height"
                  color="info"
                  size="medium"
                  placeholder="Height"
                  value={values.height}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="weight"
                  label="Weight"
                  color="info"
                  size="medium"
                  placeholder="Weight"
                  value={values.weight}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="width"
                  label="Width"
                  color="info"
                  size="medium"
                  placeholder="Width"
                  value={values.width}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                  fullWidth
                  name="mrp"
                  label="Regular Price"
                  color="info"
                  size="medium"
                  placeholder="Regular Price"
                  value={values.mrp}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="salePrice"
                  label="Sale Price"
                  color="info"
                  size="medium"
                  placeholder="Sale Price"
                  value={values.salePrice}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                  fullWidth
                  name="author"
                  label="Author"
                  color="info"
                  size="medium"
                  placeholder="Author"
                  value={values.author}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  name="manufacturer"
                  label="Manufacturer"
                  color="info"
                  size="medium"
                  placeholder="Manufacturer"
                  value={values.manufacturer}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <H4>New Arrival</H4>
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
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              
            </Grid>
            <Grid item sm={12} xs={4}>
                <Divider sx={{my: 4,}}/>
                <Paragraph fontWeight={700} mb={4}>
                  Other Details
                </Paragraph>
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
              <Tab label="Image" value="image" disableRipple />
              <Tab label="Tags" value="tags" disableRipple />
              <Tab label="Social Links" value="social-links" disableRipple />
              <Tab label="SEO" value="seo" disableRipple />
              <Tab label="Gallery Images" value="gallery-images" disableRipple />
              <Tab label="Stock" value="stock" disableRipple />
            </StyledTabList>
          </Box>

          <StyledTabPanel value="image">
            <ImageForm />
          </StyledTabPanel>

          <StyledTabPanel value="tags">
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
          </StyledTabPanel>

          <StyledTabPanel value="social-links">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Social Links</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="facebook_link"
                label="Facebook"
                value={values.facebook_link}
                onChange={handleChange}
                placeholder="https://example.com"
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
                name="youtube_link"
                label="Youtube"
                value={values.youtube_link}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
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
                InputProps={{
                  startAdornment: (
                    <YouTube
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
                name="metaTitle"
                label="Meta Title"
                value={values.metaTitle}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
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
                name="metaDescription"
                label="Meta Description"
                onChange={handleChange}
                value={values.metaDescription}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
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
          </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="gallery-images">
            <GalleryForm />
          </StyledTabPanel>

          <StyledTabPanel value="stock">
          <Grid container spacing={3}>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="stock"
                label="Stock"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.stock}
                // error={!!touched.site_name && !!errors.site_name}
                // helperText={touched.site_name && errors.site_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                name="stockCheckQty"
                label="Enter check qty (at which alert will be generate)"
                value={values.stockCheckQty}
                // error={!!touched.site_description && !!errors.site_description}
                // helperText={touched.site_description && errors.site_description}
              />
            </Grid>

          </Grid>
          </StyledTabPanel>
        </TabContext>
        <Grid item sm={6} xs={12}>
          <Divider sx={{my: 4,}}/>
          <Button variant="contained" color="info" type="submit">
            Save product
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default ProductForm;
