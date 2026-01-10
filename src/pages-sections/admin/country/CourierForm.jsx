import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { Field,Formik } from "formik";
import React from "react";
import Image from 'next/image'
import Select from '@mui/material/Select';
import {server_ip} from "utils/backend_server_ip.jsx"


// ================================================================
const CourierForm = (props) => {
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
                  fullWidth
                  name="shortCode"
                  label="Short Code"
                  color="info"
                  disabled={props.isDisabled}
                  size="medium"
                  inputProps={{ style: { textTransform: "lowercase" } }}
                  placeholder="Short Code"
                  value={values.shortCode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.shortCode && !!errors.shortCode}
                  helperText={touched.shortCode && errors.shortCode}
                />
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

export default CourierForm;
