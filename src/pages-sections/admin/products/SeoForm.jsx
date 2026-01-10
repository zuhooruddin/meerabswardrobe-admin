import { Facebook, Instagram, Twitter, YouTube, InfoIcon } from "@mui/icons-material";
import { Button, Divider, Grid, TextField } from "@mui/material";
import AppleStore from "components/icons/AppleStore";
import PlayStore from "components/icons/PlayStore";
import { H4 } from "components/Typography";
import { Formik } from "formik";
import React from "react";

const SeoForm = () => {
  const initialValues = {
    metaUrl: "",
    metaTitle: "",
    metaDescription: "",
  };

  const handleFormSubmit = async (values) => {
    console.log(values);
  };

  return (
    // <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
    //   {({ values, handleChange, handleSubmit }) => (
    //     <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Product SEO</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="metaUrl"
                label="Meta URL"
                value={initialValues.metaUrl}
                // onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="metaTitle"
                label="Meta Title"
                value={initialValues.metaTitle}
                // onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="metaDescription"
                label="Meta Description"
                // onChange={handleChange}
                value={initialValues.metaDescription}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <YouTube
                      fontSize="small"
                      color="info"
                      sx={{
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
    //       {/* <Button
    //         type="submit"
    //         color="info"
    //         variant="contained"
    //         sx={{
    //           mt: 4,
    //         }}
    //       >
    //         Save Changes
    //       </Button> */}
    //     {/* </form>
    //   )}
    // </Formik> */}
  );
};

export default SeoForm;
