import { Delete } from "@mui/icons-material";
import { Button, Divider, Grid, IconButton, TextField } from "@mui/material";
import DropZone from "components/DropZone";
import { FlexBetween } from "components/flex-box";
import ReactQuill from "components/ReactQuill"; // import ReactQuill from "components/ReactQuill";
import CloseIcon from '@mui/icons-material/Close';

import { H4 } from "components/Typography";
import { FieldArray, Formik } from "formik";
import React, { Fragment } from "react";

const FooterForm = (props) => {
  const { initialValues, validationSchema, handleFormSubmit } = props;

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema}
      onSubmit={handleFormSubmit}>
      {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
            <DropZone
            onChange={(files) => {
              setFieldValue('footerLogo', files[0]);
            }}
            title="Drag & Drop Footer Logo"
          />
          <br /><br />
          {values.footerLogo && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(values.footerLogo)}
                alt="Selected footer logo"
                style={{ maxWidth: '200px' }}
              />
              <button
                type="button"
                onClick={() => setFieldValue('footerLogo', null)}
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
              <TextField
                rows={4}
                multiline
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                onChange={handleChange}
                name="footer_description"
                label="Footer Description"
                value={values.footer_description}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FieldArray
              name="column_two_links"
              render={(arrayHelper) => (
                <Fragment>
                  <Grid item xs={12}>
                    <FlexBetween>
                      <H4>Second Column Content</H4>

                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          arrayHelper.push({
                            id: Date.now(),
                            name: "",
                            link: "",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                    </FlexBetween>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      color="info"
                      size="medium"
                      onBlur={handleBlur}
                      label="Heading Name"
                      onChange={handleChange}
                      name="column_two_heading"
                      value={values.column_two_heading}
                    />
                  </Grid>

                  {values.column_two_links?.map((item, index) => (
                    <Grid item container spacing={2} key={item.id}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Name"
                          color="info"
                          size="medium"
                          value={item.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_two_links.${index}.name`}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Link"
                          color="info"
                          size="medium"
                          value={item.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_two_links.${index}.link`}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton onClick={() => arrayHelper.remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <FieldArray
              name="column_three_links"
              render={(arrayHelper) => (
                <Fragment>
                  <Grid item xs={12}>
                    <FlexBetween>
                      <H4>Third Column Content</H4>

                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => {
                          arrayHelper.push({
                            id: Date.now(),
                            name: "",
                            link: "",
                          });
                        }}
                      >
                        Add Item
                      </Button>
                    </FlexBetween>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      color="info"
                      size="medium"
                      onBlur={handleBlur}
                      label="Heading Name"
                      onChange={handleChange}
                      name="column_three_heading"
                      value={values.column_three_heading}
                    />
                  </Grid>

                  {values.column_three_links?.map((item, index) => (
                    <Grid item container spacing={2} key={item.id}>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Name"
                          color="info"
                          size="medium"
                          value={item.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_three_links.${index}.name`}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Link"
                          color="info"
                          size="medium"
                          value={item.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`column_three_links.${index}.link`}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton onClick={() => arrayHelper.remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <H4 mb={2}>Four Column Content</H4>

              <TextField
                fullWidth
                color="info"
                size="medium"
                label="Heading"
                onBlur={handleBlur}
                onChange={handleChange}
                name="column_four_heading"
                value={values.column_four_heading}
                sx={{
                  mb: 3,
                }}
              />

              <ReactQuill
                box_height={200}
                value={values.column_four_description}
                onChange={(value) =>
                  setFieldValue("column_four_description", value)
                }
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            color="info"
            variant="contained"
            sx={{
              mt: 4,
            }}
          >
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default FooterForm;
