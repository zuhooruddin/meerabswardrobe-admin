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
import CityConfigurationForm  from "pages-sections/admin/country/CityConfigurationForm";
import CityConfigurationRow  from "pages-sections/admin/country/CityConfigurationRow";
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

CityConfiguration.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================

function CityConfiguration() {
    const router = useRouter();
    
    const [cityList, setCityList] = useState(null);
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
        country:[],
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
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllCity?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data && data!=cityList){
    setCityList(data);setUseSwrFlag(false);
  }


  const { data:data1, error:error1 } = useSWR(server_ip+`getcountries`, fetcher);



    async function addCity(data, setdisableButtonCheck, event, values){
        const myNewModel = await axiosInstance
          .post(`${server_ip}addCity`, data, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization':'Bearer '+session.accessToken
              },
          }).then((res) => {
            // setdisableButtonCheck(true);
            setdisableButtonCheck(false);
            if(res.data.ErrorCode==0){
              toast.success("City Added Successfully", {position: toast.POSITION.TOP_RIGHT});
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
    const handleDelete = (id) => {
      deleteCity(id);
    };
    async function deleteCity(id){
      const myNewModel = await axiosInstance
        .post(`${server_ip}deleteCity`, id, {
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
        formData.append("country", values['country']);

        formData.append("type", values['type']);
        formData.append("status", values['status']);
        addCity(formData,setdisableButtonCheck,event,values);
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
      listData: cityList?cityList['results']:[],
      rowsPerPage: rowsPerPage,
    });

      // if(cityList){  
        return (
          <>
            <Box py={4}>
              <H3 mb={2}> City Configuration</H3>
              <CityConfigurationForm
                isDisabled= {false}
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleFormSubmit={handleFormSubmit}
                disableButtonCheck = {disableButtonCheck}
                countrylist={data1&&data1.countrylist?data1.countrylist:[]}
              />
            </Box>
            <Box pb={4}>
              <H3 mb={2}>City List</H3>
              <SearchArea
              handleSearch={(event) => {setSearchText(event.target.value);}}
              handleSearchClick = {(event) => { setSearch(searchText);setUseSwrFlag(true);}}
              handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true);}}
              buttonText="Add City"
              handleBtnClick={() => {router.push('/admin/country/city-configuration');}}
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
                        rowCount={cityList?cityList['results'].length:0}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        // order={null}
                        // orderBy={null}
                      />
        
                    <TableBody>
                      {cityList&&cityList?cityList['results'].map((data, index) => (
                        <CityConfigurationRow
                          item={data}
                          key={index}
                          handleDeleteCity = {handleDelete}
                          // selected={selected}
                        />
                      )):''}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
                <TablePagination
                  component="div"
                  count={cityList?cityList['count']:''}
                  page={pageIndex}
                  onPageChange={handleChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Box>
          </>
        );
      // }
      // else{
      //   <p>Loading...</p>
      // }
}
    
const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
});

export default CityConfiguration;

CityConfiguration.auth = true;

