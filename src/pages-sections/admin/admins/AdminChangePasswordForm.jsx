import { Button, Grid, TextField } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import {server_ip} from "utils/backend_server_ip.jsx";
import {useSession} from 'next-auth/react';
import { useRouter } from 'next/router';

const AdminChangePasswordForm = ({adminDetail}) => {
  const [loadingButton, setLoadingButton] = useState(false);
  const { data: session,status} = useSession();
  const router = useRouter();

  const initialValues = {
    old_password: "",
    new_password1: "",
    new_password2: ""
  };

  async function updateAdminPassword(data){
    const schoolModel = await axiosInstance
      .post(server_ip+`api/auth/password/change/${adminDetail['id']}/${session.accessToken}`, data, {
          headers: {
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
        if(res.status == 200){
          toast.success("Updated Successfully", {
            position: toast.POSITION.TOP_RIGHT
          });
          router.push('/admin/users/profile');
        }
        else{
          toast.error("Not Updated", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else{
            toast.error('Error Occured! '+error.response.statusText, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          return error.response
        } else if (error.request) {
          /// Network error api call not reached on server 
          toast.error('Network Error', {
            position: toast.POSITION.TOP_RIGHT
          });
          return error.request
        } else {
          toast.error('Error Occured', {
            position: toast.POSITION.TOP_RIGHT
          });
          return error
        }
      });
  }

  const handleFormSubmit = async (values) => {
    updateAdminPassword(values);
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            {/* <Grid item xs={12}>
              <H4>Shipping and Vat</H4>
            </Grid> */}

            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                // type="number"
                name="old_password"
                type="password"
                onBlur={handleBlur}
                label="Old Password"
                onChange={handleChange}
                value={values.old_password}
                error={!!touched.old_password && !!errors.old_password}
                helperText={touched.old_password && errors.old_password}
              />
            </Grid>

            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                name="new_password1"
                type="password"
                color="info"
                size="medium"
                label="New Password"
                value={values.new_password1}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.new_password1 && !!errors.new_password1}
                helperText={touched.new_password1 && errors.new_password1}
              />
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                name="new_password2"
                type="password"
                color="info"
                size="medium"
                label="Confirm Password"
                value={values.new_password2}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.new_password2 && !!errors.new_password2}
                helperText={touched.new_password2 && errors.new_password2}
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

export default AdminChangePasswordForm;
