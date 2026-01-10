import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { BrandRow } from "pages-sections/admin";
import  CourierRow  from "pages-sections/admin/courier/CourierRow";

import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR, { useSWRConfig } from 'swr'
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import {useSession} from 'next-auth/react';
import axiosInstance from "axios";
import { toast } from 'react-toastify';
import TablePagination from '@mui/material/TablePagination';

const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "country",
    label: "Country",
    align: "left",
  },
  {
    id: "time",
    label: "Estimated Time",
    align: "left",
  },
 
  // {
  //   id: "price",
  //   label: "Price",
  //   align: "left",
  // },

  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; // =============================================================================

CourierList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function CourierList(props) {
  const router = useRouter();
  const { mutate } = useSWRConfig()
  const { data: session,status} = useSession();
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [useScrollFlag,setUseScrollFlag] = useState(false);
  const [courierList, setCourierList] = useState(null);
  
  const handleChange = (event, value) => {
    setPageIndex(value);
    setUseSwrFlag(true);
  };
  const handleDelete = (id) => {
    deletecourier(id);
  };



 
  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json', 
      Authorization: 'Bearer ' + session.accessToken, 
    };
  
    const requestOptions = {
      method: 'GET',
      headers: headers,
    };
  
    fetch(server_ip + 'getcourier', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setCourierList(data);
      })
      .catch((error) => {
        console.error(error);
        
      });
  }, []);
  

  async function deletecourier(id){
    const myNewModel = await axiosInstance
      .post(`${server_ip}deletecourier`, id, {
          headers: {
            'content-type': 'application/json',
            'Authorization':'Bearer '+session.accessToken
          },
      }).then((res) => {
        console.log("Resul",res)
          if(res.status===200 ){
         
            toast.success(res.data.Msg, {position: toast.POSITION.TOP_RIGHT});

            window.location.href = '/admin/courier';

          }
         
          return res;
      }).catch((error) => {
        toast.error(error, {position: toast.POSITION.TOP_RIGHT});

     
      });
  }

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: courierList?courierList.courierlist
    :[],
    rowsPerPage: rowsPerPage,
  });
  return (
    <Box py={4}>
      <H3 mb={2}>Couriers</H3>



      <Card>
        <Scrollbar>
          <TableContainer
            sx={{
              minWidth: 900,
            }}
          >
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={courierList?courierList.length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Courier Found
        </TableCell>
      </TableRow>
    ):
                (courierList.courierlist
                  .map((brand, index) => (
                  <CourierRow
                    item={brand}
                    key={index}
                    selected={selected}
                    handleDeleteBrand = {handleDelete}
                    rowsPerPageRouter={rowsPerPage}
                  />
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

   
     

      </Card>
    </Box>
  );
}

CourierList.auth = true
