import { Clear } from "@mui/icons-material";
import { Box, Button, Grid, styled } from "@mui/material";
import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import NextImage from "next/image";
import React from "react";
import { Formik, Form, Field } from "formik";
import CloseIcon from '@mui/icons-material/Close';

const UploadBox = styled(Box)(() => ({
  width: 170,
  height: "auto",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
}));

const StyledClear = styled(Clear)(() => ({
  top: 5,
  right: 5,
  fontSize: 14,
  color: "red",
  cursor: "pointer",
  position: "absolute",
}));

const BannerSlider = (props) => {
  const { handleFormSubmit } = props;

  return (
    <Formik
      initialValues={{
        bannerslider: null,
      }}
      onSubmit={(values) => {
        handleFormSubmit(values.bannerslider);
      }}
    >
      {({ setFieldValue, values }) => (
        <Form encType="multipart/form-data">
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
              setFieldValue('bannerslider', files[0]);
            }}
            title="Drag & Drop Footer Bannerslider"
          />
          <br /><br />
          {values.bannerslider && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(values.bannerslider)}
                alt="Selected footer logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('bannerslider', null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                 right:'90',
                  backgroundColor: 'transparent',
                  color:'red',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CloseIcon />
              </button>
            </div>
          )}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="info" variant="contained">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BannerSlider;
