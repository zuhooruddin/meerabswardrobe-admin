import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Field,Formik } from "formik";
import React from "react";

// ================================================================
const CityConfigurationForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, disableButtonCheck,countrylist } = props;
  var disableButton = false
  if(disableButtonCheck==true){disableButton=true} 
  let disabledField = true;
console.log("Country list",countrylist)


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
                  // disabled={props.isDisabled}
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
      <MenuItem key={country.id} value={country.id}>
        {country.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>


              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="type"
                  onBlur={handleBlur}
                  value={values.type}
                  placeholder="City Type"
                  onChange={handleChange}
                  label="City Type"
                  error={!!touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value="OTHER">OTHER CITY</MenuItem>
                  <MenuItem value="MAJOR">MAJOR CITY</MenuItem>
                  <MenuItem value="SAME">SAME CITY</MenuItem>
                  
                </TextField>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="status"
                  onBlur={handleBlur}
                  value={values.status}
                  placeholder="Bundle Type"
                  onChange={handleChange}
                  label="Status"
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  
                </TextField>
              </Grid>

              <Grid item sm={7} xs={12}>
                <Button variant="contained" color="info" type="submit" disabled={disableButton}>
                  Save Configurations
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default CityConfigurationForm;
