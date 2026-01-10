// configurations
import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import ChargesConfigurationForm  from "pages-sections/admin/courier/ChargesConfigurationForm";
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
  cityType: yup.string().required("cityType is Required"),
  weight: yup.string().required("Weight is Required"),
  price: yup.number().min(1).required("Price is Required"),
}); // =============================================================================

EditChargesConfigurations.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export default function EditChargesConfigurations(props) {


  console.log("props",props)
  const router = useRouter();
//   const { data: session, status } = useSession()
  const { data: session, status } = useSession()
  const courierList = props.courierList;

    if(props.data[0]['cityType']==null){props.data[0]['cityType']='';}
    if(props.data[0]['weight']==null){props.data[0]['weight']='';}
    if(props.data[0]['price']==null){props.data[0]['price']='';}
    if(props.data[0]['addOn']==null){props.data[0]['addOn']='';}
    if(props.data[0]['status']==null){props.data[0]['status']='';}

    const [disableButtonCheck,setdisableButtonCheck] = useState(false)

    const initialValues = {
      id: props.data[0]['id'],
      courier:props.data[0]['courier'],
      cityType: props.data[0]['cityType'],
      weight: props.data[0]['weight'],
      price: props.data[0]['price'],
      addOn: props.data[0]['addOn'],
      status: props.data[0]['status'],
    };
    
    async function updateChargesConfiguration(data,id,setdisableButtonCheck){

      const configurationsModel = await axiosInstance
        .patch(server_ip+`updateChargesConfiguration/${id}`, data, {
          headers: {
              "Content-Type": "application/json",
              'Authorization':'Bearer '+session.accessToken
            },
        }).then((res) => {
          if(res.status == 200){
            toast.success("Charges Configurations Updated Successfully", {position: toast.POSITION.TOP_RIGHT});
            // router.push('/admin/courier/charges-configuration');
            window.location.href = "/admin/courier/charges-configuration";
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
              toast.error('Error Occured while updating Charges Configurations: '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
      if(values.cityType!=initialValues['courier']){formData.append("courier", values['courier']);}

      if(values.cityType!=initialValues['cityType']){formData.append("cityType", values['cityType']);}
      if(values.weight!=initialValues['weight']){formData.append("weight", values['weight']);}
      if(values.price!=initialValues['price']){formData.append("price", values['price']);}
      if(values.addOn!=initialValues['addOn']){formData.append("addOn", values['addOn']);}
      if(values.status!=initialValues['status']){formData.append("status", values['status']);}
      updateChargesConfiguration(formData,values.id,setdisableButtonCheck);
    };

    return (
      <Box py={4}>
        <H3 mb={2}>Edit Charges Configurations</H3>
        <ChargesConfigurationForm
              // isDisabled= {true}
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleFormSubmit={handleFormSubmit}
              disableButtonCheck = {disableButtonCheck}
              courierList={courierList}

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

  const data = await api.getChargesConfiguration(ConfigId, sessionValue.accessToken);
  const courierList = await api.getAllCourier(sessionValue.accessToken);

  return { props: { data:data,courierList} }
}

EditChargesConfigurations.auth = true