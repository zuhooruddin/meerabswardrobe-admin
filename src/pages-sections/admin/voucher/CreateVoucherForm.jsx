import { Button, Card, Grid, MenuItem, TextField,InputLabel  } from "@mui/material";
import DropZone from "components/DropZone";
import { Formik } from "formik";
import React from "react";

// ================================================================
const CreateVoucherForm = (props) => {
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
                  name="status"
                  onBlur={handleBlur}
                  placeholder="Status"
                  onChange={handleChange}
                  value={values.status}
                  label="Select Status"
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">InActive</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
             
            
                  setFieldValue('voucherimage', files[0]);
              
              }}
              

          
            title="Drag & Drop Image Here"
          />
           
        
            </Grid>


              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="code"
                  color="info"
                  size="medium"
                  label="Code"
                  placeholder="Code"
                  onBlur={handleBlur}
                  value={values.code}
                  onChange={handleChange}
                  error={!!touched.code && !!errors.code}
                  helperText={touched.code && errors.code}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="discount"
                  label="Discount(%)"
                  color="info"
                  size="medium"
                  placeholder="Discount"
                  onBlur={handleBlur}
                  value={values.discount}
                  onChange={handleChange}
                  error={!!touched.discount&& !!errors.discount}
                  helperText={touched.discount && errors.discount}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
  <InputLabel htmlFor="startdate">Start Date</InputLabel>
  <TextField
    fullWidth
    name="startdate"
    color="info"
    type="date"
    size="medium"
    placeholder="Start Date"
    value={values.startdate}
    onBlur={handleBlur}
    onChange={handleChange}
    error={!!touched.startdate && !!errors.startdate}
    helperText={touched.startdate && errors.startdate}
  />
</Grid>
<Grid item sm={6} xs={12}>
  <InputLabel htmlFor="enddate">End Date</InputLabel>
  <TextField
    fullWidth
    name="enddate"
    color="info"
    type="date"
    size="medium"
    placeholder="End Date"
    value={values.enddate}
    onBlur={handleBlur}
    onChange={handleChange}
    error={!!touched.enddate && !!errors.enddate}
    helperText={touched.enddate && errors.enddate}
  />
</Grid>

          

              <Grid item sm={6} xs={12}>
                <Button variant="contained" color="info" type="submit">
                  Save Voucher
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default CreateVoucherForm;
