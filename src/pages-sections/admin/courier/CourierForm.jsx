import { Button, Card, Grid, TextField,Divider,styled,MenuItem, } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { H4 } from "components/Typography";
import Image from 'next/image'
import {server_ip} from "utils/backend_server_ip.jsx"

// ================================================================
const CourierForm = (props) => {
  const myLoader = ({ src, width, quality }) => {
    return server_ip+`media/${src}?w=${width}&q=${quality || 75}`
  }
  const disabledField = false
  const { initialValues, validationSchema, handleFormSubmit, disableButtonCheck, convertToSlug,countrylist  } = props;



  
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
                <H4>Courier Details</H4>
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
    select
    fullWidth
    color="info"
    size="medium"
    name="country"
    onBlur={handleBlur}
    value={values.country}
    onChange={handleChange}
    label="Country"
    error={!!touched.country && !!errors.country}
    helperText={touched.country && errors.country}
  >
    {countrylist.map((country) => (
      <MenuItem key={country.name} value={country.name}>
        {country.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
             
            
                
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="time"
                  label="Estimated Delivery "
                  color="info"
                  size="medium"
                  placeholder="Estimated Delivery"
                  value={values.time}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.time && !!errors.time}
                  helperText={touched.time && errors.time}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                disabled={true}
                  inputProps={{ maxLength: 60 }}
                  fullWidth
                  name="price"
                  label="Shipping Price"
                  color="info"
                  size="medium"
                  placeholder="Shipping Price"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
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

export default CourierForm;
