import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { CustomerRow } from "pages-sections/admin";
import React from "react";
import { useState } from "react";
import useSWR from 'swr'
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import {useSession} from 'next-auth/react';

const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    align: "left",
  },
  {
    id: "phone",
    label: "Phone",
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    align: "left",
  },
  // {
  //   id: "orders",
  //   label: "No Of Orders",
  //   align: "left",
  // },

]; // =============================================================================

CustomerList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function CustomerList() {
  const { data: session,status} = useSession();
  const [pageIndex, setPageIndex] = useState(1);
  const [search,setSearch] = useState('');
  const [searchText,setSearchText] = useState('');
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(server_ip+`getAllCustomers?page=${pageIndex}&search=${search}`, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  const handleChange = (event, value) => {
    setPageIndex(value);
  };
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: data?data['results']:[],
  });
  return (
    <Box py={4}>
      <H3 mb={2}>Customers</H3>

      <SearchArea
        handleSearch={(event) => {setSearchText(event.target.value);}}
        handleSearchClick = {(event) => { setSearch(searchText)}}
        handleClearClick = {() => setSearch('')}
        buttonText="Add Customer"
        handleBtnClick={() => {}}
        searchPlaceholder="Search Customer..."
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
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={data?data['results'].length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Customer Found
        </TableCell>
      </TableRow>
    ):
                (filteredList.map((customer, index) => (
                  <CustomerRow customer={customer} key={index} />
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
        <Pagination count={data?Math.ceil(data['count']/20):''} variant="outlined" color="primary" onChange={handleChange} />
        <Span color="grey.600" style={{marginTop:'1%'}}>Showing {data?((pageIndex-1)*20)+1:''}-{data?((pageIndex-1)*20) + data['results'].length:''} of {data?data['count']:''} Customers</Span>
        </Stack>
      </Card>
    </Box>
  );
}
