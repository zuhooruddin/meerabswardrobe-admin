// configurations
import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import  CountryConfigurationForm  from "pages-sections/admin/country/CountryConfigurationForm";
import { useRouter } from 'next/router'
import api from "utils/api/dashboard";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { toast } from 'react-toastify';
import React, {useState} from "react";
import * as yup from "yup"; // form field validation schema
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react"
import Login from "pages-sections/sessions/Login";


const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    type: yup.string().required("required"),
    status: yup.string().required("required"),
}); // =============================================================================

EditCountryConfigurations.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditCountryConfigurations(props) {
  const router = useRouter();
//   const { data: session, status } = useSession()
  const { data: session, status } = useSession()

    if(props.data[0]['name']==null){props.data[0]['name']='';}
    if(props.data[0]['type']==null){props.data[0]['type']='';}
    if(props.data[0]['status']==null){props.data[0]['status']='';}

    const [disableButtonCheck,setdisableButtonCheck] = useState(false)

    const initialValues = {
      id: props.data[0]['id'],
      name: props.data[0]['name'],
      type: props.data[0]['type'],
      status: props.data[0]['status'],
    };
    
    async function updateCountryConfiguration(data,id,setdisableButtonCheck){

      const configurationsModel = await axiosInstance
        .patch(server_ip+`updateCountryConfiguration/${id}`, data, {
          headers: {
              "Content-Type": "application/json",
              'Authorization':'Bearer '+session.accessToken
            },
        }).then((res) => {
          if(res.status == 200){
            toast.success("Country Configurations Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
            // router.push('/admin/courier/city-configuration');
            window.location.href = "/admin/country/country-configuration";
            
          }
            return res;
        }).catch((error) => {
            // return error.response;
            if (error.response) {
              // if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              var a =Object.keys(error.response.data)[0]
              toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
            }
            else{
              toast.error('Error Occured while updating Country Configurations: '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
            }
            return error.response
          } else if (error.request) {
            // Network error api call not reached on server 
            toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
            return error.request
          } else {
            toast.error('Error Occured', {position: toast.POSITION.TOP_RIGHT});
            return error
          }
        });
    }

    const handleFormSubmit = (values) => {
      event.preventDefault();
      const formData = new FormData();
      if(values.name!=initialValues['name']){formData.append("name", values['name']);}
      if(values.type!=initialValues['type']){formData.append("type", values['type']);}
      if(values.status!=initialValues['status']){formData.append("status", values['status']);}
      updateCountryConfiguration(formData,values.id,setdisableButtonCheck);
    };

    return (
      <Box py={4}>
        <H3 mb={2}>Edit Configurations</H3>
        <CountryConfigurationForm 
              // isDisabled= {true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleFormSubmit={handleFormSubmit}
              disableButtonCheck = {disableButtonCheck}
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
  const ConfigId = context.query['id'];
  const data = await api.getCountryConfiguration(ConfigId, sessionValue.accessToken);
  return { props: { data:data} }
}

EditCountryConfigurations.auth = true