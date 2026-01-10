import { Button, Card, Grid, MenuItem, TextField,Divider,Tab,styled,Box } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { H4 } from "components/Typography";

// ================================================================
const UserForm = (props) => {

  const { initialValues, validationSchema, handleFormSubmit,disabledFieldValue,disableButtonCheck,disableStatus  } = props;
  var disableButton = false
  var disabledField = false
  if(disabledFieldValue){disabledField=true}
  if(disableButtonCheck==true){disableButton=true}


  const validate = (password,confirmPassword) =>{
    if(password==confirmPassword){
      return true
    }
    else{
    return false;
    }
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
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <H4>User Information</H4>
              </Grid>
              <Grid item sm={6} xs={12}>
              <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  type="text"
                  name="role"
                  label="Role"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Role"
                  value={values.role}
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  {/* <MenuItem value="1">Super Admin</MenuItem> */}
                  <MenuItem value="2">Admin</MenuItem>
                  {/* <MenuItem value="3">Customer</MenuItem> */}

                </TextField>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  color="info"
                  size="medium"
                  placeholder="Email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
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
                  fullWidth
                  name="mobile"
                  label="Mobile"
                  color="info"
                  size="medium"
                  type="number"
                  placeholder="Mobile"
                  value={values.mobile}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.mobile && !!errors.mobile}
                  helperText={touched.mobile && errors.mobile}
                />
              </Grid>
              
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  disabled={disabledField}
                  name="password"
                  label="Password"
                  type="password"
                  color="info"
                  size="medium"
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  disabled={disabledField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  color="info"
                  size="medium"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
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


                </TextField>
              </Grid>
              
            </Grid>
        <Grid item sm={6} xs={12}>
          <Divider sx={{my: 4,}}/>
          <Button variant="contained" color="info" type="submit" disabled={!validate(values.password,values.confirmPassword) || disableButton}>
            Save Details
          </Button>
        </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default UserForm;
