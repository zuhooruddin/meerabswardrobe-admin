import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { BrandForm } from "pages-sections/admin";
import { useRouter } from 'next/router';
import api from "utils/api/dashboard";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx";
import { toast } from 'react-toastify';

import React, {useState} from "react";
import * as yup from "yup"; // form field validation schema
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react";

const validationSchema = yup.object().shape({
  name: yup.string().required("required"),
  slug: yup.string().required("required"),
}); // =============================================================================

EditBrand.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditBrand(props) {
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
    id:               props.data[0]['id'],
    name:             props.data[0]['name'],
    slug:             props.data[0]['slug'],
    image:            props.data[0]['icon'],
    metaUrl:          props.data[0]['metaUrl'],
    metaTitle:        props.data[0]['metaTitle'],
    metaDescription:  props.data[0]['metaDescription'],
    // isBrand:true,
  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }

  async function updateBrand(data,id,setdisableButtonCheck){
    const brandModel = await axiosInstance
      .patch(server_ip+`updateBrand/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
        if(res.status == 200){
          setdisableButtonCheck(true);
          toast.success("Updated Successfully", {
            position: toast.POSITION.TOP_RIGHT
          });
          // window.location.href = '/admin/brands';
          // router.push('/admin/brands');
          router.push({
            pathname: `/admin/brand`,
            query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
          })
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

  const handleFormSubmit = (values) => {
    event.preventDefault();
    const formData = new FormData();
    if (values.icon){
      formData.append("icon", values['icon'], 
      values['icon'].name);
    }
    if(values.name!=initialValues['name']){formData.append("name", values['name'])}
    if(values.slug!=initialValues['slug']){formData.append("slug", values['slug'])}
    if(values.metaUrl!=initialValues['metaUrl']){formData.append("metaUrl", values['metaUrl'])}
    if(values.metaTitle!=initialValues['metaTitle']){formData.append("metaTitle", values['metaTitle'])}
    if(values.metaDescription!=initialValues['metaDescription']){formData.append("metaDescription", values['metaDescription'])}

    // updateSchool(formData,values.id,setdisableButtonCheck);
    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
      }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){updateBrand(formData,values.id,setdisableButtonCheck);}

  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Brand</H3>

      <BrandForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        disableButtonCheck = {disableButtonCheck}
        convertToSlug     = {convertToSlug}
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
  const slug = context.query['id'];
  const data = await api.getBrand(slug,sessionValue.accessToken);

  // Pass data to the page via props
  return { props: { data:data } }
}


