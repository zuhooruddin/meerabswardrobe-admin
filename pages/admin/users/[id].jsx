import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { AdminForm } from "pages-sections/admin";
import { useRouter } from 'next/router';
import api from "utils/api/dashboard";
import { toast } from 'react-toastify';
import React,{useState} from "react";
import * as yup from "yup"; // form field validation schema
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react"

async function updateUser(values,router,setdisableButtonCheck,session){
  await api.updateAdmin(values,session.accessToken).then((response) => {
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

const validationSchema = yup.object().shape({
  role: yup.string().required("required"),
  email: yup.string().required("required"),
  name: yup.string().required("required"),
  status: yup.string().required("required"),
}); // =============================================================================

EditAdmin.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditAdmin(props) {
  const { data: session,status} = useSession();
  const router = useRouter();
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)

  const initialValues = {
    id: props.data[0]['id'],
    role: props.data[0]['role'],
    email: props.data[0]['email'],
    name: props.data[0]['name'],
    mobile: props.data[0]['mobile'],
    status: props.data[0]['status'],
    password:"",
    confirmPassword:"",
    showPassword: false,
  };

  const handleFormSubmit = (values) => {
    event.preventDefault();
    updateUser(values,router,setdisableButtonCheck,session);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Admin</H3>
      <AdminForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        disabledFieldValue= {true}
        disableButtonCheck = {disableButtonCheck}
        disableStatus   = {false}

      />
    </Box>
  );
}

export async function getServerSideProps(context) {
  var sessionValue = await getSession(context);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const adminId = context.query['id'];
  const data = await api.getAdmin(adminId,sessionValue.accessToken);

  return { props: { data:data } }
}

EditAdmin.auth = true

