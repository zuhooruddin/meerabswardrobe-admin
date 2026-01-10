// configurations
import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { ConfigurationForm } from "pages-sections/admin";
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
    priority: yup.number().required("required").min(1, 'Number must be greater than 0'),
    value: yup.number().required("required").min(1, 'Number must be greater than 0'),
}); // =============================================================================

EditConfigurations.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditConfigurations(props) {
  const router = useRouter();
//   const { data: session, status } = useSession()
  const { data: session, status } = useSession()

    if(props.data[0]['name']==null){props.data[0]['name']='';}
    if(props.data[0]['value']==null){props.data[0]['value']='';}
    if(props.data[0]['location']==null){props.data[0]['location']='';}
    if(props.data[0]['priority']==null){props.data[0]['priority']='';}

    const [disableButtonCheck,setdisableButtonCheck] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    const initialValues = {
      id: props.data[0]['id'],
      name: props.data[0]['name'],
      value: props.data[0]['value'],
      priority: props.data[0]['priority'],
      location: props.data[0]['location'],
    };
    
    async function updateConfiguration(data,id,setdisableButtonCheck){

      const configurationsModel = await axiosInstance
        .patch(server_ip+`updateConfiguration/${id}`, data, {
          headers: {
              "Content-Type": "application/json",
              'Authorization':'Bearer '+session.accessToken
            },
        }).then((res) => {
          if(res.status == 200){
            checkConfigurationChange(res.data);
            toast.success("Configurations Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
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
              toast.error('Error Occured while updating Configurations: '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
    async function checkConfigurationChange(data){
      const myNewModel = await axiosInstance
        .post(`${server_ip}checkConfigurationChange`, data, {
          headers: {
              "Content-Type": "application/json",
              "Authorization":'Bearer '+session.accessToken,
          },
        }).then((res) => {
            if(res.data['ErrorCode']==0){
              // toast.success("Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
              router.push('/admin/homePage/configurations');
            }
            else{
              toast.error("Failed to update Configurations! Kindly contact the Administrator.", {position: toast.POSITION.TOP_RIGHT});
            }
            return res;
        }).catch((error) => {
            // return error.response;
            if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              var a =Object.keys(error.response.data)[0]
              toast.error("Error Occured while updating Configurations", {position: toast.POSITION.TOP_RIGHT});
            }
            else{
              toast.error('Error occured while checking Configurations change '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
            }
            return error.response
          } else if (error.request) {
            /// Network error api call not reached on server 
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
      if(values.value!=initialValues['value']){formData.append("value", values['value']);}
      if(values.priority!=initialValues['priority']){formData.append("priority", values['priority']);}
      if(values.location!=initialValues['location']){formData.append("location", values['location']);}
      updateConfiguration(formData,values.id,setdisableButtonCheck);
    };

    return (
      <Box py={4}>
        <H3 mb={2}>Edit Configurations</H3>
        <ConfigurationForm
              isDisabled= {true}
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
  const data = await api.getConfiguration(ConfigId, sessionValue.accessToken);
  return { props: { data:data} }
}

EditConfigurations.auth = true