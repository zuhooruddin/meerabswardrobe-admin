import { Button, Card, Grid, MenuItem, TextField,Divider,Tab,styled,Box } from "@mui/material";
import DropZone from "components/DropZone";
import { Formik } from "formik";
import React, { useState } from "react";
import { H4, Paragraph } from "components/Typography";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Autocomplete from '@mui/material/Autocomplete';


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

  const disabledField = false
  const { initialValues, validationSchema, handleFormSubmit, partyDetails } = props;
  return (
    <Card
      sx={{
        p: 6,
      }}
    >
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <H4>Third Party Detail</H4>
              </Grid>
              <Grid item sm={12} xs={12}>
              <TextField
                id="thirdPartyId"
                name="thirdPartyId"
                select
                fullWidth
                label="Select"
                value={values.thirdPartyId}
                onChange={handleChange}
                helperText="Please Select Type"
                variant="filled"
                >
                {partyDetails.map((option) => (
                  <MenuItem key={option.name} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>

              </Grid>
              <Grid item sm={6} xs={12}>
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
                  error={!!touched.slug && !!errors.slug}
                  helperText={touched.slug && errors.slug}
                />
              </Grid>
              {/* <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="discountType"
                  label="Discount Type"
                  color="info"
                  size="medium"
                  placeholder="Discount Type"
                  value={values.discountType}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.discountType && !!errors.discountType}
                  helperText={touched.discountType && errors.discountType}
                />
                </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
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
                </Grid> */}
                <Grid item xs={12}>
                  <DropZone name="image" title="Drag & drop Third Party Detail image here" imageSize="Upload 280*280 image" onChange={(files) => console.log(files)} />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <H4>SEO Fields (optional)</H4>
                </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="metaUrl"
                  label="Meta Url"
                  color="info"
                  size="medium"
                  placeholder="Meta Url"
                  value={values.metaUrl}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.metaUrl && !!errors.metaUrl}
                  helperText={touched.metaUrl && errors.metaUrl}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="metaTitle"
                  label="Meta Title"
                  color="info"
                  size="medium"
                  placeholder="Meta Title"
                  value={values.metaTitle}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.metaTitle && !!errors.metaTitle}
                  helperText={touched.metaTitle && errors.metaTitle}
                />
              </Grid>

              <Grid item sm={4} xs={12}>
                <TextField
                  fullWidth
                  name="metaDescription"
                  label="Meta Description"
                  color="info"
                  size="medium"
                  placeholder="Meta Description"
                  value={values.metaDescription}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.metaDescription && !!errors.metaDescription}
                  helperText={touched.metaDescription && errors.metaDescription}
                />
              </Grid>
              
            </Grid>
        <Grid item sm={6} xs={12}>
          <Divider sx={{my: 4,}}/>
          <Button variant="contained" color="info" type="submit">
            Save Details
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
        {/* <Grid item sm={12} xs={4}>
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
            <TagForm />
          </StyledTabPanel>

          <StyledTabPanel value="social-links">
            <SocialLinksForm />
          </StyledTabPanel>

          <StyledTabPanel value="seo">
            <SeoForm />
          </StyledTabPanel>

          <StyledTabPanel value="gallery-images">
            <GalleryForm />
          </StyledTabPanel>

          <StyledTabPanel value="stock">
            <StockForm />
          </StyledTabPanel>
        </TabContext> */}
    </Card>
  );
};

export default ProductForm;
