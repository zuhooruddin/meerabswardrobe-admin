import { Box, Card, Select, FormControl, FormHelperText, MenuItem, InputLabel, Autocomplete, Input, TextField, Stack, Button, Table, TableContainer} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
// import TableHeader from "components/data-table/TableHeader";
import TableHeader from "components/data-table/ConfigurationsTableHeader";
import TableBody from "@mui/material/TableBody";
import Scrollbar from "components/Scrollbar";

import { H3,Span } from "components/Typography";
import React from "react";
import api from "utils/api/dashboard"; // table column list
import { useRouter } from "next/router";
import { useState,useEffect } from "react";
import useSWR from 'swr'
import * as yup from "yup";
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx";
import { useSession } from "next-auth/react";
// import { makeStyles } from '@material-ui/core/styles'
import { Formik } from "formik";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import { ConfigurationForm } from "pages-sections/admin";
import { ConfigurationRow } from "pages-sections/admin";
import { mutate } from "swr"
import Login from "pages-sections/sessions/Login";


const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "value",
    label: "Value",
    align: "left",
  },
  {
    id: "location",
    label: "Location",
    align: "left",
  },
  {
    id: "priority",
    label: "Priority",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; 

// =============================================================================

Configurations.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================

function Configurations() {
    const router = useRouter();
    const { data: session, status } = useSession()
    const [disableButtonCheck,setdisableButtonCheck] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const initialValues = {
        name: '',
        value: '',
        priority: 1,
        location: '',
    };
    
    const address = server_ip+"AllConfiguration";
    const { data:ConfigurationData, error:ConfigurationError} = useSWR(address, async url => {
        const response = await axios.get(url)
        mutate(address, response.data, false);
        return response.data;
    });

    async function addConfiguration(data, setdisableButtonCheck){
        const myNewModel = await axiosInstance
          .post(`${server_ip}addConfiguration`, data, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization':'Bearer '+session.accessToken
              },
          }).then((res) => {
            // setdisableButtonCheck(true);
            setdisableButtonCheck(false);
            console.log('res', res);
            if(res.status==200){
              toast.success("Configurations Done Successfully", {position: toast.POSITION.TOP_RIGHT});
              // router.push('/admin/homePage/configurations');
              mutate(address, prevData => {
                return [...prevData, res.data]; });
            }
            // toast.success("Configurations Done Successfully", {position: toast.POSITION.TOP_RIGHT});
              // console.log(res);
              return res;
          }).catch((error) => {
            // return error.response;
            if (error.response) {
              //// if api not found or server responded with some error codes e.g. 404
            if(error.response.status==400){
              var a =Object.keys(error.response.data)[0]
              toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
            }
            else{
              toast.error('Error Occured while setting up Configurations '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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
    
    const handleFormSubmit = (values,event) => {
        // event.preventDefault();    
        const formData = new FormData();
        formData.append("name", values['name']);
        formData.append("value", values['value']);
        formData.append("priority", values['priority']);
        formData.append("location", values['location']);
        addConfiguration(formData,setdisableButtonCheck);
        // toast.success("Configurations Done Successfully", {position: toast.POSITION.TOP_RIGHT});
        event.resetForm(values);
    };

      if(ConfigurationData){  
        return (
          <>
            <Box py={4}>
              <H3 mb={2}>Configurations</H3>
              <ConfigurationForm
                isDisabled= {false}
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
                disableButtonCheck = {disableButtonCheck}
              />
            </Box>
            <Box pb={4}>
              <H3 mb={2}>Configurations List</H3>
              <Card>
                <Scrollbar>
                  <TableContainer
                    sx={{
                      minWidth: 900,
                    }}
                  >
                    <Table>
                      <TableHeader
                        hideSelectBtn
                        heading={tableHeading}
                        // order={null}
                        // orderBy={null}
                      />
        
                    <TableBody>
                      {ConfigurationData.map((data, index) => (
                        <ConfigurationRow
                          item={data}
                          key={index}
                          // selected={selected}
                        />
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Box>
          </>
        );
      }
      else{
        <p>Loading...</p>
      }
}
    
const validationSchema = yup.object().shape({
    name: yup.string().required("required"),
    priority: yup.number().required("required").min(1, 'Number must be greater than 0'),
    value: yup.number().required("required").min(1, 'Number must be greater than 0'),
});

export default Configurations;

Configurations.auth = true;

