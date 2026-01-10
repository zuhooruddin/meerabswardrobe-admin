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
import { useSession } from "next-auth/react";
// import { makeStyles } from '@material-ui/core/styles'
import { Formik } from "formik";
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import { CourierForm } from "pages-sections/admin";
import { CourierRow } from "pages-sections/admin";
import { mutate } from "swr"
import Login from "pages-sections/sessions/Login";

import SearchArea from "components/dashboard/SearchArea";
import TablePagination from '@mui/material/TablePagination';
import useMuiTable from "hooks/useMuiTable";


const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "shortCode",
    label: "Short Code",
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

Courier.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================

function Courier() {
    const router = useRouter();
    const [courierList, setCourierList] = useState(null);
    const [useSwrFlag,setUseSwrFlag] = useState(true); 
    const [pageIndex, setPageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [search,setSearch] = useState('');
    const [searchText,setSearchText] = useState('');

    const { data: session, status } = useSession()
    const [disableButtonCheck,setdisableButtonCheck] = useState(false)
    const initialValues = {
        id: null,
        name: '',
        type: 'OTHER',
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
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllCourier?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data && data!=courierList){
    setCourierList(data);setUseSwrFlag(false);
  }

    async function addCourier(data, setdisableButtonCheck,event,values){
        const myNewModel = await axiosInstance
          .post(`${server_ip}addCourier`, data, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization':'Bearer '+session.accessToken
              },
          }).then((res) => {
            // setdisableButtonCheck(true);
            setdisableButtonCheck(false);
            if(res.data.ErrorCode==0){
              toast.success("Courier Added Successfully", {position: toast.POSITION.TOP_RIGHT});
              // router.push('/admin/homePage/configurations');
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
              toast.error('Error Occured while adding Courier '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
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

    const handleDelete = (id) => {
      deleteCourier(id);
    };
    async function deleteCourier(id){
      const myNewModel = await axiosInstance
        .post(`${server_ip}deleteCourier`, id, {
            headers: {
              'content-type': 'application/json',
              'Authorization':'Bearer '+session.accessToken
            },
        }).then((res) => {
          console.log(res);
            if(res.data['ErrorCode']==0 ){
              setUseSwrFlag(true);
              toast.success(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
            }
            else{
              toast.error(res.data['ErrorMsg'], {position: toast.POSITION.TOP_RIGHT});
            }
            return res;
        }).catch((error) => {
          if (error.response) {
            toast.error('Error Occured', {
              position: toast.POSITION.TOP_RIGHT
            });
            return error.response
          } else if (error.request) {
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
    
    const handleFormSubmit = (values,event) => {
        // event.preventDefault();    
        const formData = new FormData();
        formData.append("name", values['name']);
        formData.append("shortCode", values['shortCode']);
        addCourier(formData,setdisableButtonCheck,event,values);
        // toast.success("Configurations Done Successfully", {position: toast.POSITION.TOP_RIGHT});
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
      listData: courierList?courierList['results']:[],
      rowsPerPage: rowsPerPage,
    });

      if(courierList){  
        return (
          <>
            <Box py={4}>
              <H3 mb={2}>Courier</H3>
              <CourierForm
                isDisabled= {false}
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
                disableButtonCheck = {disableButtonCheck}
              />
            </Box>
            <Box pb={4}>
              <H3 mb={2}>Courier List</H3>
              <SearchArea
              handleSearch={(event) => {setSearchText(event.target.value);}}
              handleSearchClick = {(event) => { setSearch(searchText);setUseSwrFlag(true);}}
              handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true);}}
              buttonText="Add City"
              handleBtnClick={() => {router.push('/admin/courier/city-configuration');}}
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
                        rowCount={courierList?courierList['results'].length:0}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // order={null}
                        // orderBy={null}
                      />
        
                    <TableBody>
                      {courierList['results'].map((data, index) => (
                        <CourierRow
                          item={data}
                          key={index}
                          handleDeleteCourier = {handleDelete}
                          // selected={selected}
                        />
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  component="div"
                  count={courierList?courierList['count']:''}
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
    name: yup.string().max(100).required("required"),
    shortCode: yup.string().max(100).required("required"),

});

export default Courier;

Courier.auth = true;

