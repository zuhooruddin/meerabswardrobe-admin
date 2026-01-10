import { Box, Card, Select, FormControl, FormHelperText, MenuItem, InputLabel, Autocomplete, Input, TextField, Stack, Button, Table, TableContainer} from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import TableHeader from "components/data-table/TableHeader";
// import TableHeader from "components/data-table/ConfigurationsTableHeader";
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
import { useSession,signOut } from "next-auth/react";
// import { makeStyles } from '@material-ui/core/styles'
import { Formik } from "formik";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import { ChargesConfigurationForm } from "pages-sections/admin";
import { ChargesConfigurationRow } from "pages-sections/admin";
import { mutate } from "swr";
import { getSession } from "next-auth/react";

import SearchArea from "components/dashboard/SearchArea";
import TablePagination from '@mui/material/TablePagination';
import useMuiTable from "hooks/useMuiTable";


const tableHeading = [
  {
    id: "courier",
    label: "Courier",
    align: "left",
  },
  {
    id: "cityType",
    label: "City Type",
    align: "left",
  },
  {
    id: "weight",
    label: "Weight",
    align: "left",
  },
  {
    id: "price",
    label: "Price",
    align: "left",
  },
  {
    id: "addOn",
    label: "addOn",
    align: "left",
  },
  {
    id: "status",
    label: "Status",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; 

// =============================================================================

ChargesConfiguration.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================

function ChargesConfiguration(props) {
    const router = useRouter();
    
    const [configurationList, setConfigurationList] = useState(null);
    const [useSwrFlag,setUseSwrFlag] = useState(true); 
    const [pageIndex, setPageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [search,setSearch] = useState('');
    const [searchText,setSearchText] = useState('');
    const courierList = props.courierList;


    const { data: session, status } = useSession()
    const [disableButtonCheck,setdisableButtonCheck] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
    const initialValues = {
        id: null,
        courier: '',
        cityType: '',
        weight: '',
        price:'',
        addOn:false,
        status: 'ACTIVE',
    };
    const handleChange = (event, value) => {
      setPageIndex(value);
      setUseSwrFlag(true);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPageIndex(0);
      setUseSwrFlag(true);
    };
    
    // const address = server_ip+"AllConfiguration";
    // const { data:ConfigurationData, error:ConfigurationError} = useSWR(address, async url => {
    //     const response = await axios.get(url)
    //     mutate(address, response.data, false);
    //     return response.data;
    // });

  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllCourierConfiguration?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data && data!=configurationList){
    setConfigurationList(data);setUseSwrFlag(false);
  }


    async function addChargesConfiguration(data, setdisableButtonCheck,event,values){
        const myNewModel = await axiosInstance
          .post(`${server_ip}addChargesConfiguration`, data, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization':'Bearer '+session.accessToken
              },
          }).then((res) => {
            // setdisableButtonCheck(true);
            setdisableButtonCheck(false);
            if(res.data.ErrorCode==0){
              toast.success("Configuration Added Successfully", {position: toast.POSITION.TOP_RIGHT});
              setUseSwrFlag(true);
              event.resetForm(values);
            }
            else{
              toast.error(res.data.ErrorMsg, {position: toast.POSITION.TOP_RIGHT});
            }
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
        formData.append("courier", values['courier']);
        formData.append("cityType", values['cityType']);
        formData.append("weight", values['weight']);
        formData.append("price", values['price']);
        formData.append("addOn", values['addOn']);
        formData.append("status", values['status']);
        addChargesConfiguration(formData,setdisableButtonCheck,event,values);
        // event.resetForm(values);
    };
    const {
      order,
      orderBy,
      selected,
      // rowsPerPage,
      filteredList,
      handleChangePage,
      handleRequestSort,
    } = useMuiTable({
      listData: configurationList?configurationList['results']:[],
      rowsPerPage: rowsPerPage,
    });

      if(configurationList){  
        return (
          <>
            <Box py={4}>
              <H3 mb={2}>Courier Charges Configuration</H3>
              <ChargesConfigurationForm
                isDisabled= {false}
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
                disableButtonCheck = {disableButtonCheck}
                courierList={courierList}
              />
            </Box>
            <Box pb={4}>
              <H3 mb={2}>Configuration List</H3>
              <SearchArea
              handleSearch={(event) => {setSearchText(event.target.value);}}
              handleSearchClick = {(event) => { setSearch(searchText);setUseSwrFlag(true);}}
              handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true);}}
              buttonText="Add City"
              handleBtnClick={() => {router.push('/admin/courier/charges-configuration');}}
              searchPlaceholder="Search City..."
              searchText      = {searchText}

            />
              <Card>
                <Scrollbar>
                  <TableContainer
                    sx={{
                      minWidth: 900,
                    }}
                  >
                    <Table>
                      <TableHeader
                        orderBy={orderBy}
                        order={order}
                        hideSelectBtn
                        heading={tableHeading}
                        rowCount={configurationList?configurationList['results'].length:0}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // order={null}
                        // orderBy={null}
                      />
        
                    <TableBody>
                      {configurationList['results'].map((data, index) => (
                        <ChargesConfigurationRow
                          item={data}
                          key={index}
                          // selected={selected}
                        />
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  component="div"
                  count={configurationList?configurationList['count']:''}
                  page={pageIndex}
                  onPageChange={handleChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
    courier: yup.string().required("Courier is Required"),
    cityType: yup.string().required("cityType is Required"),
    weight: yup.string().required("Weight is Required"),
    price: yup.number().min(1).required("Price is Required"),

});

export default ChargesConfiguration;

export async function getServerSideProps(context) {
  try{
  var sessionValue = await getSession(context);
  console.log('########### Session #############');
  console.log(sessionValue);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/super-admin-login',
        permanent: false,
      },
    };
  }
  const courierList = await api.getAllCourier(sessionValue.accessToken);
  return {
    props: {
      courierList
    }
  };
  } catch (error) {
  console.error('Error occurred while getting the session:', error);
  // Handle the error, for example, redirect to an error page or show an error message
  signOut();
  return {
    redirect: {
      destination: '/super-admin-login',
      permanent: false,
    },
  };
}
};

ChargesConfiguration.auth = true;

