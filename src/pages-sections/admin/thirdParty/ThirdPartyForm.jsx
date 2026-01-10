import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { Field,Formik } from "formik";
import React from "react";

// ================================================================
const ThirdPartyForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;

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
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              
              {/* <Grid item sm={6} xs={12}>
                <TextField
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
                  <MenuItem value="3">DELETED</MenuItem>

                </TextField>
              </Grid> */}

              <Grid item sm={6} xs={12}>
                <Button variant="contained" color="info" size="large" type="submit">
                  Save Type
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default ThirdPartyForm;
