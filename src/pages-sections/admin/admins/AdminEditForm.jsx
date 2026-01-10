import { Button, Grid, TextField } from "@mui/material";
import { Formik } from "formik";
import React,{useState} from "react";
import api from "utils/api/dashboard";
import * as yup from "yup";
import {useSession} from 'next-auth/react';
import { toast } from 'react-toastify';

async function updateUser(values,setdisableButtonCheck,session){
  setdisableButtonCheck(true);
  await api.updateAdminProfile(values,session.accessToken).then((response) => {
    if(response.data['ErrorCode']==1){
      toast.error(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else{
      setdisableButtonCheck(false);
      toast.success(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    return response.data
  }).catch((error) => {
    if (error.response) {
      //// if api not found or server responded with some error codes e.g. 404
      toast.error('Error Occured', {
        position: toast.POSITION.TOP_RIGHT
      });
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

const validationSchema = yup.object().shape({
  name: yup.string().required("name is required"),
  // email: yup.string().required("site description is required"),
  mobile: yup.string().required("mobile number required"),
});

const AdminEditForm = ({adminDetail}) => {
  const { data: session,status} = useSession();
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)

  const initialValues = {
    id: adminDetail['id'],
    name: adminDetail['name'],
    email: adminDetail['email'],
    mobile: adminDetail['mobile'],
  };

  const handleFormSubmit = async (values) => {
    updateUser(values,setdisableButtonCheck,session);

  };

  return (
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
         
            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                name="name"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
            </Grid>
            <Grid item md={7} xs={12}>
              <TextField
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                onChange={handleChange}
                name="mobile"
                label="Mobile"
                value={values.mobile}
                error={!!touched.mobile && !!errors.mobile}
                helperText={touched.mobile && errors.mobile}
              />
            </Grid>

            <Grid item md={7} xs={12}>
              <TextField
                disabled={true}
                fullWidth
                color="info"
                size="medium"
                onBlur={handleBlur}
                name="email"
                onChange={handleChange}
                label="Email"
                value={values.email}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
            </Grid>

          </Grid>

          <Button
            disabled = {disableButtonCheck}
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

export default AdminEditForm;
