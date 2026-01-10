import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import Image from 'next/image'
import {server_ip} from "utils/backend_server_ip.jsx"

// ================================================================
const CategoryForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, allCategories, disableButtonCheck, convertToSlug, disableStatus } = props;
  var disableButton = false
  if(disableButtonCheck==true){disableButton=true}
  const status = status => (status == 1 ? 'ACTIVE' : status == 2? 'INACTIVE':'DELETED');
  const myLoader = ({ src, width, quality }) => {
    return server_ip+`/media/${src}?w=${width}&q=${quality || 75}`
  }
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
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
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="category"
                  onBlur={handleBlur}
                  placeholder="Category"
                  onChange={handleChange}
                  value={values.category || ''}
                  label="Select Parent Category"
                  error={!!touched.category && !!errors.category}
                  helperText={touched.category && errors.category}
                >
                  {allCategories.map(category =>{
                    {if(category['id']==values.id && category['parentId'] == null){return(<MenuItem disabled><b>{category['name']}</b></MenuItem>)}
                    else if(category['id']==values.id){return(<MenuItem disabled>---{category['name']}</MenuItem>)}
                    else if (category['parentId'] == null){
                      return(<MenuItem value={category['id']} key={category['id']}><b>{category['name']}</b></MenuItem>)
                    } 
                    else{
                    return(<MenuItem value={category['id']} key={category['id']}>---{category['name']}</MenuItem>)
                    }}
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <input id="file" accept="image/jpeg,image/png,image/gif" name="file" type="file" onChange={(event) => {
                setFieldValue("file", event.currentTarget.files[0]);
                }} />
                 <Image
                loader={myLoader}
                src={values.image}
                alt="Category Image"
                width={200}
                height={200}
                />
              </Grid>

              <Grid item xs={12}>
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
                  value={values.description || ''}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="slug"
                  color="info"
                  size="medium"
                  label="Slug"
                  placeholder="Slug"
                  onBlur={handleBlur}
                  value={values.slug}
                  onChange={handleChange}
                  error={!!touched.slug && !!errors.slug}
                  helperText={touched.slug && errors.slug}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="metaUrl"
                  color="info"
                  size="medium"
                  label="Meta Url"
                  placeholder="Meta Url"
                  onBlur={handleBlur}
                  value={values.metaUrl || ''}
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
                  onBlur={handleBlur}
                  value={values.metaTitle || ''}
                  onChange={handleChange}
                  error={!!touched.metaTitle && !!errors.metaTitle}
                  helperText={touched.metaTitle && errors.metaTitle}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  inputProps={{ maxLength: 200 }}
                  fullWidth
                  name="metaDescription"
                  color="info"
                  size="medium"
                  // type="number"
                  onBlur={handleBlur}
                  value={values.metaDescription || ''}
                  label="Meta Description"
                  onChange={handleChange}
                  placeholder="Meta Description"
                  error={!!touched.metaDescription && !!errors.metaDescription}
                  helperText={touched.metaDescription && errors.metaDescription}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  disabled={disableStatus}
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  type="text"
                  name="status"
                  label="Status"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Status"
                  value={values.status}
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                  
                >
                  <MenuItem value="1">ACTIVE</MenuItem>
                  <MenuItem value="2">INACTIVE</MenuItem>
                  {/* <MenuItem value="3">DELETED</MenuItem> */}

                </TextField>
              </Grid>

              <Grid item sm={7} xs={12}>
                <Button variant="contained" color="info" type="submit" disabled={disableButton}>
                  Save Category
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default CategoryForm;
