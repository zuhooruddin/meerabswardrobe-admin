import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { Field,Formik } from "formik";
import React from "react";
import Image from 'next/image'
import Select from '@mui/material/Select';
import {server_ip} from "utils/backend_server_ip.jsx"


// ================================================================
const ConfigurationForm = (props) => {
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
                  disabled={props.isDisabled}
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
                    name="value"
                    label="Value"
                    color="info"
                    size="medium"
                    placeholder="Value"
                    value={values.value}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.value && !!errors.value}
                    helperText={touched.value && errors.value}
                    />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    color="info"
                    size="medium"
                    placeholder="Location"
                    value={values.location}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // error={!!touched.value && !!errors.value}
                    // helperText={touched.value && errors.value}
                    />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                    // select
                    fullWidth
                    name="priority"
                    label="Priority"
                    color="info"
                    size="medium"
                    placeholder="Value"
                    value={values.priority}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.priority && !!errors.priority}
                    helperText={touched.priority && errors.priority}
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

export default ConfigurationForm;
