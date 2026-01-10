import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { BrandRow } from "pages-sections/admin";
import  VoucherRow  from "pages-sections/admin/voucher/VoucherRow";

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
    id: "code",
    label: "Code",
    align: "left",
  },
  {
    id: "status",
    label: "Status",
    align: "left",
  },
 
  {
    id: "icon",
    label: "Icon",
    align: "left",
  },
  {
    id: "discount",
    label: "Discount",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; // =============================================================================

VoucherList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function VoucherList(props) {
  const router = useRouter();
  const { mutate } = useSWRConfig()
  const { data: session,status} = useSession();
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [useScrollFlag,setUseScrollFlag] = useState(false);
  const [voucherList, setVoucherList] = useState(null);

  
  const handleChange = (event, value) => {
    setPageIndex(value);
    setUseSwrFlag(true);
  };
  const handleDelete = (id) => {
    deleteVoucher(id);
  };



 
   useEffect(() => {
    fetch(server_ip+'getvoucher')
      .then((res) => res.json())
      .then((data) => {
        setVoucherList(data)
        
      })
  }, [])

  async function deleteVoucher(id){
    const myNewModel = await axiosInstance
      .post(`${server_ip}deletevoucher`, id, {
          headers: {
            'content-type': 'application/json',
            'Authorization':'Bearer '+session.accessToken
          },
      }).then((res) => {
        console.log("Resul",res)
          if(res.status===200 ){
         
            toast.success(res.data.Msg, {position: toast.POSITION.TOP_RIGHT});

            window.location.href = '/admin/voucher';

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
    listData: voucherList?voucherList.voucher:[],
    rowsPerPage: rowsPerPage,
  });
  return (
    <Box py={4}>
      <H3 mb={2}>Vouchers</H3>



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
                rowCount={voucherList?voucherList.length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Voucher Found
        </TableCell>
      </TableRow>
    ):
                (voucherList.voucher.map((brand, index) => (
                  <VoucherRow
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

VoucherList.auth = true
