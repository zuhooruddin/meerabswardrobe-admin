import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { BrandForm } from "pages-sections/admin";
import React, {useState} from "react";
import * as yup from "yup";
import {server_ip} from "utils/backend_server_ip.jsx"
import axiosInstance from "axios";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';

const CreateBrand = (props) => {
  const router = useRouter();
  const { data: session,status} = useSession();
  const callAPI = async () => {
    try {
        const res = await fetch(
            `/api/auth/session`,
            {
                method: 'GET',
            }
        );
        const data = await res.json();
        session = data;
    } catch (err) {
      toast.error('Session refresh failed!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
};
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
      callAPI();
  };
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const initialValues = {
    name: "",
    slug: "",
    image: "category_icon/Branding.png",
    metaUrl:"",
    metaTitle:"",
    metaDescription:"",
    isBrand:true,

  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }
  async function addBrand(data,setdisableButtonCheck){
    const myNewModel = await axiosInstance
      .post(`${server_ip}addBrand`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken
          },
      }).then((res) => {
          if(res.status == 201){
            setdisableButtonCheck(true);
            toast.success(res.statusText, {
              position: toast.POSITION.TOP_RIGHT
            });
            window.location.href = '/admin/brand';
            // router.push('/admin/schools', '/admin/schools', { reload: true });
          }
          else{
            toast.error(res.data['ErrorMsg'], {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          return res;
      }).catch((error) => {
          if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              for(var i=0;i<Object.keys(error.response.data).length;i++){
                var key = Object.keys(error.response.data)[i];
                var value = error.response.data[key].toString()
                toast.error(<div>Field: {key} <br/>Error Message: {value}</div>, {position: toast.POSITION.TOP_RIGHT});
              }
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

  const handleFormSubmit = (values) => {
    event.preventDefault();
    const formData = new FormData();
    if (values.icon){
      formData.append("icon", values['icon'], 
      values['icon'].name);
    }
    formData.append("name", values['name']);
    formData.append("slug", values['slug']);
    formData.append("metaUrl", values['metaUrl']);
    formData.append("metaTitle", values['metaTitle']);
    formData.append("metaDescription", values['metaDescription']);
    formData.append("isBrand", values['isBrand']);

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
      }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){addBrand(formData,setdisableButtonCheck);}
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Brand</H3>

      <BrandForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        disableButtonCheck = {disableButtonCheck}
        convertToSlug     = {convertToSlug}
      />
    </Box>
   
  );
}; // =============================================================================

CreateBrand.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

const validationSchema = yup.object().shape({
  name: yup.string().required("Brand Name Required"),
  slug: yup.string().required("Slug Required"),

});
export default CreateBrand;

CreateBrand.auth = true
