import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import CourierForm from "pages-sections/admin/courier/CourierForm";
import { useRouter } from 'next/router'
import api from "utils/api/dashboard";
import axiosInstance from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { toast } from 'react-toastify';
import React, {useState} from "react";
import * as yup from "yup"; 
import {useSession} from 'next-auth/react';
import { getSession } from "next-auth/react";
import axios from "axios";
import useSWR from 'swr'

const validationSchema = yup.object().shape({
  name: yup.string().required("Required"),
  country:yup.string().required("Please select status"),
  time:yup.string().required("Required"),

  
});

EditVoucher.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; 

export default function EditVoucher(props) {



const courierdata=props.data.courier[0]


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
  if(courierdata['name']==null){courierdata['name']='';}
  if(courierdata['countryname']==null){courierdata['countryname']='';}
  if(courierdata['time']==null){courierdata['time']='';}
  if(courierdata['country']==null){courierdata['country']='';}


  const [disableButtonCheck,setdisableButtonCheck] = useState(false)

  const initialValues = {
    id: courierdata['id'],
    name: courierdata['name'],
    country: courierdata['countryname'],
    time: courierdata['time'],

  };
  
  function formatDateString(dateString) {
    if (!dateString) return ''; 
  
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split('T')[0];
  }
 

  const handleFormSubmit = async(values) => {
    event.preventDefault();
    const formData = new FormData();

    console.log("Values",values)


    formData.append("id",courierdata['id'] || null);
    formData.append("name", values["name"] || null);
    formData.append("country", values["country"] || null);
    formData.append("time", values["time"] || null);
    // formData.append("price", values["price"] || null);
 

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){

      try {
        const response = await axios.post(server_ip+'updatecourier', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: "Bearer " + session.accessToken,

          },
        });
        if(response.status===200){

            toast.success(response.data.Msg, {
                position: toast.POSITION.TOP_RIGHT
              });
              window.location.href = '/admin/courier';

        }
  
      } catch (error) {
        toast.error(error, {
            position: toast.POSITION.TOP_RIGHT
          });      }
        }
    
  };
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);

  const { data, error } = useSWR(server_ip+`getcountries`, fetcher);

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Courier</H3>

      <CourierForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        countrylist={data&&data.countrylist?data.countrylist:[]}

      />
    </Box>
  );
};

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
  const id= context.query['id'];

  console.log("id",id)
  const data = await api.getCourier(id,sessionValue.accessToken);

  return { props: { data:data } }
}

EditVoucher.auth = true

