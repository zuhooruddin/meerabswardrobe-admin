import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { CategoryForm } from "pages-sections/admin";
import { useRouter } from 'next/router'
import api from "utils/api/dashboard";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { toast } from 'react-toastify';
import React, {useState} from "react";
import * as yup from "yup"; // form field validation schema
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name Required"),
  category: yup.string().nullable().notRequired(),
  description: yup.string().required("Description Required"),
  status: yup.number().required("Status Required"),
}); // =============================================================================

EditCategory.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditCategory(props) {
  const router = useRouter();
  const { data: session, status, update } = useSession()

  // Redirect to login if session is not available
  if (status === "loading") {
    return <Box py={4}>Loading...</Box>;
  }

  // if (!session || !session.accessToken) {
  //   router.push('/login');
  //   return null;
  // }

  const reloadSession = async () => {
    try {
      await update(); // This will trigger NextAuth to refresh the session
    } catch (err) {
      toast.error('Session refresh failed!', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };
  if(props.data[0]['description']==null){props.data[0]['description']='';}
  if(props.data[0]['metaUrl']==null){props.data[0]['metaUrl']='';}
  if(props.data[0]['metaTitle']==null){props.data[0]['metaTitle']='';}
  if(props.data[0]['metaDescription']==null){props.data[0]['metaDescription']='';}

  const allCategories = props.allCategories;
  const [disableButtonCheck,setdisableButtonCheck] = useState(false)

  const initialValues = {
    id: props.data[0]['id'],
    name: props.data[0]['name'],
    category: props.data[0]['parentId'],
    image: props.data[0]['icon'],
    description: props.data[0]['description'],
    slug: props.data[0]['slug'],
    metaUrl: props.data[0]['metaUrl'],
    metaTitle: props.data[0]['metaTitle'],
    metaDescription: props.data[0]['metaDescription'],
    status: props.data[0]['status'],
  };
  function convertToSlug(Text) {
    return Text.toLowerCase()
              .replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+|_/g,'');
  }
  async function updateCategory(data,id,setdisableButtonCheck){
    if (!session || !session.accessToken) {
      toast.error('Session expired. Please login again.', {position: toast.POSITION.TOP_RIGHT});
      router.push('/login');
      return;
    }

    const categoryModel = await axiosInstance
      .patch(server_ip+`updateCategory/${id}`, data, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
        if(res.status == 200){
          // setdisableButtonCheck(true);
          checkCategoryChange(res.data);
          toast.success("Category Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
          // router.push('/admin/categories');
        }
          return res;
      }).catch((error) => {
          // return error.response;
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status === 401){
            // Token expired or invalid - try to refresh session
            reloadSession().then(() => {
              toast.info('Session expired. Please try again.', {position: toast.POSITION.TOP_RIGHT});
            });
          } else if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while updating Category '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
  async function checkCategoryChange(data){
    if (!session || !session.accessToken) {
      toast.error('Session expired. Please login again.', {position: toast.POSITION.TOP_RIGHT});
      router.push('/login');
      return;
    }

    const myNewModel = await axiosInstance
      .post(`${server_ip}checkCategoryChange`, data, {
          headers: {
              "Content-Type": "application/json",
              "Authorization":'Bearer '+session.accessToken,
          },
      }).then((res) => {
          if(res.data['ErrorCode']==0){
            toast.success("Sequence & Box Order Updated", {position: toast.POSITION.TOP_RIGHT});
            // router.push('/admin/categories');
            // window.location.href = '/admin/categories';
            router.push({
              pathname: `/admin/categories`,
              query: { pageIndexRouter: router.query.pageIndexRouter, scrollPosition:router.query.scrollPosition, rowsPerPageRouter:router.query.rowsPerPageRouter },
            })
          }
          else{
            toast.error("Sequence & Box Order Not Updated! Kindly Contact Administrator.", {position: toast.POSITION.TOP_RIGHT});
          }
          return res;
      }).catch((error) => {
          // return error.response;
          if (error.response) {
            //// if api not found or server responded with some error codes e.g. 404
          if(error.response.status === 401){
            // Token expired or invalid - try to refresh session
            reloadSession().then(() => {
              toast.info('Session expired. Please try again.', {position: toast.POSITION.TOP_RIGHT});
            });
          } else if(error.response.status==400){
            var a =Object.keys(error.response.data)[0]
            toast.error("Error Occured while updating Sequence & Box Order.", {position: toast.POSITION.TOP_RIGHT});
          }
          else{
            toast.error('Error Occured while checking category change '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
    
    if (!session || !session.accessToken || !session.expires) {
      toast.error('Session expired. Please login again.', {
        position: toast.POSITION.TOP_RIGHT
      });
      router.push('/login');
      return;
    }

    const formData = new FormData();
    if (values.file){
      formData.append("icon", values['file'], 
      values['slug']+"."+values['file'].name.split(".")[1]);
    }
    if(values.name!=initialValues['name']){formData.append("name", values['name'])}
    if(values.category!=initialValues['category']){formData.append("parentId", values['category'])}
    if(values.description!=initialValues['description']){formData.append("description", values['description'])}
    if(values.slug!=initialValues['slug']){formData.append("slug", values['slug'])}
    if(values.metaUrl!=initialValues['metaUrl']){formData.append("metaUrl", values['metaUrl'])}
    if(values.metaTitle!=initialValues['metaTitle']){formData.append("metaTitle", values['metaTitle'])}
    if(values.metaDescription!=initialValues['metaDescription']){formData.append("metaDescription", values['metaDescription'])}
    if(values.status!=initialValues['status']){formData.append("status", values['status'])}

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    
    if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){
      updateCategory(formData,values.id,setdisableButtonCheck);
    }
    
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Category</H3>

      <CategoryForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        allCategories = {allCategories}
        disableButtonCheck = {disableButtonCheck}
        convertToSlug     = {convertToSlug}
        disableStatus     = {false}

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
  const catSlug = context.query['id'];
  const data = await api.getCategory(catSlug,sessionValue.accessToken);
  const allCategories = await api.getAllCategories();

  return { props: { data:data,allCategories:allCategories } }
}

EditCategory.auth = true

