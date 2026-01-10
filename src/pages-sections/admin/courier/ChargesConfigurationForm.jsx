import { Button, Card, Grid, MenuItem, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { Field,Formik } from "formik";
import React from "react";
import Image from 'next/image'
import Select from '@mui/material/Select';
import {server_ip} from "utils/backend_server_ip.jsx"


// ================================================================
const ChargesConfigurationForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit, disableButtonCheck, courierList } = props;
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
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="courier"
                  onBlur={handleBlur}
                  value={values.courier}
                  placeholder="Courier Service"
                  // onChange={handleChange}
                  onChange = {handleChange}
                  label="Courier Service"
                  error={!!touched.courier && !!errors.courier}
                  helperText={touched.courier && errors.courier}
                >
                  {courierList.map(courier =>{
                    return(<MenuItem key={courier['id']} value={courier['id']}>{courier['name']}</MenuItem>)
                  })}
                  
                </TextField>
            </Grid>

            <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="cityType"
                  onBlur={handleBlur}
                  value={values.cityType}
                  placeholder="City Type"
                  onChange={handleChange}
                  label="City Type"
                  error={!!touched.cityType && !!errors.cityType}
                  helperText={touched.cityType && errors.cityType}
                >
                  <MenuItem value="SAME">SAME CITY</MenuItem>
                  <MenuItem value="MAJOR">MAJOR CITY</MenuItem>
                  <MenuItem value="OTHER">OTHER CITY</MenuItem>
                  
                </TextField>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="weight"
                  label="Weight"
                  color="info"
                  // disabled={props.isDisabled}
                  size="medium"
                  placeholder="Weight"
                  value={values.weight}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.weight && !!errors.weight}
                  helperText={touched.weight && errors.weight}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  label="Price"
                  color="info"
                  // disabled={props.isDisabled}
                  size="medium"
                  type="number"
                  placeholder="Price"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="addOn"
                  onBlur={handleBlur}
                  value={values.addOn}
                  placeholder="addOn"
                  onChange={handleChange}
                  label="addOn"
                  error={!!touched.addOn && !!errors.addOn}
                  helperText={touched.addOn && errors.addOn}
                >
                  <MenuItem value={false}>FALSE</MenuItem>
                  <MenuItem value={true}>TRUE</MenuItem>
                  
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

export default ChargesConfigurationForm;
