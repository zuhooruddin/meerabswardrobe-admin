import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import CourierForm from "pages-sections/admin/courier/CourierForm";
import React from "react";
import * as yup from "yup";
import axios from "axios";
import { server_ip } from "utils/backend_server_ip.jsx";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import useSWR from 'swr'

const CreateCourier = (props) => {
  const { data: session, status } = useSession();
  const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    country:yup.string().required("Please select country"),
    time:yup.string().required("Required"),
    
    
  });
  const callAPI = async () => {
    try {
      const res = await fetch(`/api/auth/session`, {
        method: "GET",
      });
      const data = await res.json();
      session = data;
    } catch (err) {
      toast.error("Session refresh failed!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
    callAPI();
  };


  const initialValues = {
 
    name: "",
    country:'',
    time:'',
    price:'',
  

  };

 


  

  const handleFormSubmit =  async(values) => {


    console.log("Vaslues",values)
  

    const formData = new FormData();

    if (
      Math.floor(new Date(Date.now())) > Math.floor(new Date(session.expires))
    ) {
      reloadSession();
      toast.info("Session Expired! Refreshing Session....", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else if (
      Math.floor(new Date(Date.now())) < Math.floor(new Date(session.expires))
    ) {
      formData.append("name", values["name"] || null);
      formData.append("country", values["country"] || null);
      formData.append("time", values["time"] || null);
      // formData.append("price", values["price"] || null);


      try {
        const response = await axios.post(server_ip+'addcourier', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: "Bearer " + session.accessToken,

          },
        });

        console.log("response",response)


        if(response.status===200){

            toast.success(response.data.Msg, {
                position: toast.POSITION.TOP_RIGHT
              });
              window.location.href = '/admin/courier';

        }
        else if(response.data.status==='500') {

          toast.error('response.data.Msg', {
              position: toast.POSITION.TOP_RIGHT
            });
            // window.location.href = '/admin/voucher';

      }
  
      } catch (error) {
        console.log(error); 
    toast.error('An error occurred,please check courier with country name if its already added', {
        position: toast.POSITION.TOP_RIGHT
    });     }
    }

    
  };
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);

  const { data, error } = useSWR(server_ip+`getcountries`, fetcher);

  return (
    <Box py={4}>
      <H3 mb={2}>Add New Courier</H3>

      <CourierForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
        countrylist={data&&data.countrylist?data.countrylist:[]}

      />
    </Box>
  );
}; // =============================================================================

CreateCourier.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================



export default CreateCourier;

