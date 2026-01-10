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
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import  CountryConfigurationForm  from "pages-sections/admin/country/CountryConfigurationForm";
import  CountryConfigurationRow  from "pages-sections/admin/country/CountryConfigurationRow";
import { mutate } from "swr"

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
    id: "type",
    label: "Type",
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

CountryConfiguration.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================

function CountryConfiguration() {
    const router = useRouter();
    
    const [countryList, setCountryList] = useState(null);
    const [useSwrFlag,setUseSwrFlag] = useState(true); 
    const [pageIndex, setPageIndex] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [search,setSearch] = useState('');
    const [searchText,setSearchText] = useState('');

    const { data: session, status } = useSession()
    const [disableButtonCheck,setdisableButtonCheck] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);
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


  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?server_ip+`getallcountry?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  console.log("Data",data)


  if(useSwrFlag && data && data!=countryList){
    setCountryList(data);setUseSwrFlag(false);
  }


    async function addCountry(data, setdisableButtonCheck, event, values){
        const myNewModel = await axiosInstance
          .post(`${server_ip}addcountry`, data, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization':'Bearer '+session.accessToken
              },
          }).then((res) => {
            setdisableButtonCheck(false);
            if(res.data.ErrorCode==0){
              toast.success("Country Added Successfully", {position: toast.POSITION.TOP_RIGHT});
              setUseSwrFlag(true);
              event.resetForm(values);
            }
            else{
              toast.error(res.data.ErrorMsg, {position: toast.POSITION.TOP_RIGHT});
            }
              return res;
          }).catch((error) => {
            if (error.response) {
            if(error.response.status==400){
              var a =Object.keys(error.response.data)[0]
              toast.error(error.response.data[a].toString(), {position: toast.POSITION.TOP_RIGHT});
            }
            else{
              toast.error('Error Occured while setting up Configurations '+error.response.statusText, {position: toast.POSITION.TOP_RIGHT});
            }
            return error.response
          } else if (error.request) {
            toast.error('Network Error', {position: toast.POSITION.TOP_RIGHT});
            return error.request
          } 
        });
    }
    const handleDelete = (id) => {
      deleteCountry(id);
    };
    async function deleteCountry(id){
      const myNewModel = await axiosInstance
        .post(`${server_ip}deletecountry`, id, {
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
    
        const formData = new FormData();
        formData.append("name", values['name']);
        formData.append("type", values['type']);
        formData.append("status", values['status']);
        addCountry(formData,setdisableButtonCheck,event,values);
        toast.success("Configurations Done Successfully", {position: toast.POSITION.TOP_RIGHT});
        event.resetForm(values);
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
      listData: countryList?countryList['results']:[],
      rowsPerPage: rowsPerPage,
    });

      if(countryList){  
        return (
          <>
            <Box py={4}>
              <H3 mb={2}>Country Configuration</H3>
              <CountryConfigurationForm
                isDisabled= {false}
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
                disableButtonCheck = {disableButtonCheck}
              />
            </Box>
            <Box pb={4}>
              <H3 mb={2}>Country List</H3>
              <SearchArea
              handleSearch={(event) => {setSearchText(event.target.value);}}
              handleSearchClick = {(event) => { setSearch(searchText);setUseSwrFlag(true);}}
              handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true);}}
              buttonText="Add Country"
              handleBtnClick={() => {router.push('/admin/courier/country-configuration');}}
              searchPlaceholder="Search Country..."
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
                        rowCount={countryList?countryList['results'].length:0}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // order={null}
                        // orderBy={null}
                      />
        
                    <TableBody>
                      {countryList['results'].map((data, index) => (
                        <CountryConfigurationRow
                          item={data}
                          key={index}
                          handleDeleteCity = {handleDelete}
                          selected={selected}
                        />
                      ))}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  component="div"
                  count={countryList?countryList['count']:''}
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
    name: yup.string().required("Name is required"),
});

export default CountryConfiguration;

CountryConfiguration.auth = true;

