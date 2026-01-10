import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { AdminForm } from "pages-sections/admin";
import React, {useState} from "react";
import * as yup from "yup";
import api from "utils/api/dashboard";
import { useRouter } from "next/router";
// For Alert
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';


async function createUser(values,router,setdisableButtonCheck,session){
  const response = await api.addAdmin(values,session.accessToken).then((response) => {
    if(response.data['ErrorCode']==1){
      toast.error(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else{
      setdisableButtonCheck(true);
      toast.success(response.data['ErrorMsg'], {
        position: toast.POSITION.TOP_RIGHT
      });
      router.push('/admin/users');
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

const CreateUser= () => {
  const { data: session,status} = useSession();
  const router = useRouter();
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const [initialValues, setinitialValues] = useState({
    role: 2,
    email: "",
    name: "",
    status: 1,
    mobile: "",
    password:"",
    confirmPassword:"",

  });

  const handleFormSubmit = (values) => {
    createUser(values,router,setdisableButtonCheck,session);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New User</H3>

      <AdminForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        disableButtonCheck = {disableButtonCheck}
        disableStatus   = {true}
      />
    </Box>
  );
}; // =============================================================================

CreateUser.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

const validationSchema = yup.object().shape({
  role: yup.string().required("required"),
  email: yup.string().email('Invalid email').required('Required'),
  // mobile: yup.number().max(13),
  name: yup.string().required("required"),
  status: yup.string().required("required"),
  password: yup.string().required("required"),
  confirmPassword: yup.string().required("required"),


});
export default CreateUser;

CreateUser.auth = true
