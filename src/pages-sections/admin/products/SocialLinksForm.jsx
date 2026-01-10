import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";
import { Button, Divider, Grid, TextField } from "@mui/material";
import AppleStore from "components/icons/AppleStore";
import PlayStore from "components/icons/PlayStore";
import { H4 } from "components/Typography";
import { Formik } from "formik";
import React from "react";

const SocialLinksForm = (values, handleChange) => {
  // const initialValues = {
  //   facebook: "",
  //   twitter: "",
  //   instagram: "",
  //   linkedin: "",
  //   youtube: "",
  //   play_store: "",
  //   app_store: "",
  // };

  // const handleFormSubmit = async (values) => {
  //   console.log(values);
  // };

  return (
    // <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
    //   {({ values, handleChange, handleSubmit }) => (
    //     <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <H4>Social Links</H4>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="facebook_link"
                label="Facebook"
                value={values.facebook_link}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Facebook
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
                name="twitter_link"
                label="Twitter"
                value={values.twitter_link}
                onChange={handleChange}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Twitter
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
                name="instagram_link"
                label="Instagram"
                onChange={handleChange}
                value={values.instagram_link}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <Instagram
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
                name="youtube_link"
                label="Youtube"
                value={values.youtube_link}
                onChange={handleChange}
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
    //     </form>
    //   )}
    // </Formik>
  );
};

export default SocialLinksForm;
