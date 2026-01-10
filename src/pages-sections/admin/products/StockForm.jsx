import { Box, Button, Grid, styled, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
const UploadBox = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "4px",
  display: "inline-block",
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
})); // form field validation

const validationSchema = yup.object().shape({
  site_name: yup.string().required("site name is required"),
  site_description: yup.string().required("site description is required"),
  site_banner_text: yup.string().required("site banner text required"),
});

const StockForm = () => {
  const initialValues = {
    site_name: "",
    site_description: "",
    site_banner_text: "",
  };

  const handleFormSubmit = async (values) => {
    console.log(values);
  };

  return (
    // <Formik
    //   onSubmit={handleFormSubmit}
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    // >
    //   {({
    //     values,
    //     errors,
    //     touched,
    //     handleChange,
    //     handleBlur,
    //     handleSubmit,
    //   }) => (
    //     <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="stock"
                label="Stock"
                // onBlur={handleBlur}
                // onChange={handleChange}
                value={initialValues.site_name}
                // error={!!touched.site_name && !!errors.site_name}
                // helperText={touched.site_name && errors.site_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                // onBlur={handleBlur}
                // onChange={handleChange}
                name="stock"
                label="Enter check qty (at which alert will be generate)"
                value={initialValues.site_description}
                // error={!!touched.site_description && !!errors.site_description}
                // helperText={touched.site_description && errors.site_description}
              />
            </Grid>

          </Grid>

          // <Button
          //   type="submit"
          //   color="info"
          //   variant="contained"
          //   sx={{
          //     mt: 4,
          //   }}
          // >
          //   Save Changes
          // </Button>
        // </form>
      // )}
    // </Formik>
  );
};

export default StockForm;
