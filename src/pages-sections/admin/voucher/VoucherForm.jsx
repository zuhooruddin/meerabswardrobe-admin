import { Button, Card, Grid, TextField,Divider,styled } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { H4 } from "components/Typography";
import Image from 'next/image'
import {server_ip} from "utils/backend_server_ip.jsx"

// ================================================================
const BrandForm = (props) => {
  const myLoader = ({ src, width, quality }) => {
    return server_ip+`media/${src}?w=${width}&q=${quality || 75}`
  }
  const disabledField = false
  const { initialValues, validationSchema, handleFormSubmit, disableButtonCheck, convertToSlug } = props;



  
  var disableButton = false
  if(disableButtonCheck==true){disableButton=true}
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
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <H4>Brand Detail</H4>
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
                  // onChange={handleChange}
                  onChange={(event, value) => {setFieldValue('name', event.target.value);setFieldValue('slug', convertToSlug(event.target.value)); }}
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
                <Grid item xs={12}>
                  <input id="file" accept="image/jpeg,image/png,image/gif" name="file" type="file" onChange={(event) => {
                    setFieldValue("icon", event.currentTarget.files[0]);
                  }} />
                  <Image
                    loader={myLoader}
                    src={values.image}
                    alt="Brand Image"
                    width={200}
                    height={200}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <H4>SEO Fields (optional)</H4>
                </Grid>
              <Grid item sm={6} xs={12}>
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
              <Grid item sm={6} xs={12}>
                <TextField
                  inputProps={{ maxLength: 60 }}
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

              <Grid item sm={12} xs={12}>
                <TextField
                  inputProps={{ maxLength: 200 }}
                  rows={3}
                  multiline
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
          <Button variant="contained" color="info" type="submit" disabled={disableButton}>
            Save Details
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default BrandForm;
