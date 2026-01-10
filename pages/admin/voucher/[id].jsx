import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import CreateVoucherForm  from "pages-sections/admin/voucher/CreateVoucherForm";
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

const validationSchema = yup.object().shape({
  name: yup.string().required("Required"),
  status:yup.string().required("Please select status"),
  code:yup.string().required("Required"),
  discount:yup.string().required("Required"),
  startdate:yup.string().required("Required"),
  enddate:yup.string().required("Required")
  
});

EditVoucher.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; 

export default function EditVoucher(props) {



const voucherdata=props.data.voucher[0]


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
  if(voucherdata['name']==null){voucherdata['name']='';}
  if(voucherdata['status']==null){voucherdata['status']='';}
  if(voucherdata['code']==null){voucherdata['code']='';}
  if(voucherdata['discount']==null){voucherdata['discount']='';}
  if(voucherdata['startdate']==null){voucherdata['startdate']='';}
  if(voucherdata['enddate']==null){voucherdata['enddate']='';}

  const [disableButtonCheck,setdisableButtonCheck] = useState(false)

  const initialValues = {
    id: voucherdata['id'],
    name: voucherdata['name'],
    image: voucherdata['image'],
    code: voucherdata['code'],
    discount: voucherdata['discount'],
    startdate: formatDateString(voucherdata['startdate']),
    enddate: formatDateString(voucherdata['enddate']),
    status: voucherdata['status'],
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
   
    formData.append("id",values["id"] || null)
    formData.append("name", values["name"] || null);
    formData.append("status", values["status"] || null);
    formData.append("code", values["code"] || null);
    formData.append("discount", values["discount"] || null);
    formData.append("startdate", values["startdate"] || null);
    formData.append("enddate", values["enddate"] || null);
    formData.append("voucherimage", values["voucherimage"] || null);
 

    if(Math.floor(new Date(Date.now()))>Math.floor(new Date(session.expires))){
      reloadSession();
      toast.info('Session Expired! Refreshing Session.... Kindly try again to submit', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if(Math.floor(new Date(Date.now()))<Math.floor(new Date(session.expires))){

      try {
        const response = await axios.post(server_ip+'updatevoucher', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: "Bearer " + session.accessToken,

          },
        });
        if(response.status===200){

            toast.success(response.data.Msg, {
                position: toast.POSITION.TOP_RIGHT
              });
              window.location.href = '/admin/voucher';

        }
  
      } catch (error) {
        toast.error(error, {
            position: toast.POSITION.TOP_RIGHT
          });      }
        }
    
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Edit Voucher</H3>

      <CreateVoucherForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      
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
  const id= context.query['id'];

  console.log("id",id)
  const data = await api.getVoucher(id,sessionValue.accessToken);

  return { props: { data:data } }
}

EditVoucher.auth = true

