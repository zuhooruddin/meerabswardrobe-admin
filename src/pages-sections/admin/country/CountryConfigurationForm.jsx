import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import { Field,Formik } from "formik";
import React from "react";

// ================================================================
const CountryConfigurationForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, disableButtonCheck } = props;
  var disableButton = false
  if(disableButtonCheck==true){disableButton=true} 
  let disabledField = true;

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
                  name="type"
                  onBlur={handleBlur}
                  value={values.type}
                  placeholder="Country Type"
                  onChange={handleChange}
                  label="Country Type"
                  error={!!touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value="OTHER">OTHER Country</MenuItem>
                  <MenuItem value="MAJOR">MAJOR Country</MenuItem>
                  <MenuItem value="SAME">SAME Country</MenuItem>
                  
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

export default CountryConfigurationForm;
