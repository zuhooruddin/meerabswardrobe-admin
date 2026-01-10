import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import CreateVoucherForm from "pages-sections/admin/voucher/CreateVoucherForm";
import React from "react";
import * as yup from "yup";
import axios from "axios";
import { server_ip } from "utils/backend_server_ip.jsx";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";


const CreateVoucher = (props) => {
  const { data: session, status } = useSession();
  const validationSchema = yup.object().shape({
    name: yup.string().required("Required"),
    status:yup.string().required("Please select status"),
    code:yup.string().required("Required"),
    discount:yup.string().required("Required"),
    startdate:yup.string().required("Required"),
    enddate:yup.string().required("Required")
    
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
    status:"Active",
    code:'',
    discount:'',
    startdate:'',
    enddate:'',
    voucherimage:'',

  };

 


  

  const handleFormSubmit =  async(values) => {
  

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
      formData.append("status", values["status"] || null);
      formData.append("code", values["code"] || null);
      formData.append("discount", values["discount"] || null);
      formData.append("startdate", values["startdate"] || null);
      formData.append("enddate", values["enddate"] || null);
      formData.append("voucherimage", values["voucherimage"] || null);

      try {
        const response = await axios.post(server_ip+'addvoucher', formData, {
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
      <H3 mb={2}>Add New Voucher</H3>

      <CreateVoucherForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleFormSubmit={handleFormSubmit}
      
      />
    </Box>
  );
}; // =============================================================================

CreateVoucher.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================



export default CreateVoucher;

