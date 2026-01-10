import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { CategoryForm } from "pages-sections/admin";
import React, {useState} from "react";
import * as yup from "yup";
import api from "utils/api/dashboard";
import {server_ip} from "utils/backend_server_ip.jsx"
import axiosInstance from "axios";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react"


const CreateCategory = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession()
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
  const allCategories = props.allCategories;
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)
  const initialValues = {
    name: '',
    slug:'',
    category: '',
    file: '',
    description: '',
    metaUrl: '',
    metaTitle: '',
    metaDescription: '',
    image: 'category_icon/default-category-icon.jpg',
    status: 1,
  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }

  async function addCategory(data,setdisableButtonCheck){
    

    const myNewModel = await axiosInstance
      .post(`${server_ip}addCategory`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
        if(res.status==201){
          setdisableButtonCheck(true);
          toast.success("Category Created Successfully", {position: toast.POSITION.TOP_RIGHT});
          window.location.href = '/admin/categories';
          // router.push('/admin/categories');
        }
          return res;
      }).catch((error) => {
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while creating Category '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
    if (values.file){
      formData.append("icon", values['file'], 
      values['slug']+"."+values['file'].name.split(".")[1] );
    }
    formData.append("name", values['name']);
    formData.append("slug", values['slug']);
    formData.append("parentId", values['category']);
    formData.append("description", values['description']);
    formData.append("metaUrl", values['metaUrl']);
    formData.append("metaTitle", values['metaTitle']);
    formData.append("metaDescription", values['metaDescription']);

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){
      addCategory(formData,setdisableButtonCheck);
    }

  };

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Category</H3>
      <CategoryForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        allCategories = {allCategories}
        disableButtonCheck = {disableButtonCheck}
        convertToSlug     = {convertToSlug}
        disableStatus     = {true}
      />
    </Box>
  );
}; // =============================================================================

CreateCategory.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    slug: yup.string().required("required"),
    // category: yup.string().required("required"),
    description: yup.string().required("required"),
    status: yup.number().required("required"),
});
export default CreateCategory;

export async function getServerSideProps(context) {
    var sessionValue = await getSession(context);
    const allCategories = await api.getAllLocalCategories();
    if (!sessionValue) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return { props: { allCategories:allCategories } }
  }

CreateCategory.auth = true
