import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { OrderRow } from "pages-sections/admin";
import React from "react";
import {useSession} from 'next-auth/react';
// SWR
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from 'swr'
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
// tooltip
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FlexBox } from "components/flex-box";
import InfoIcon from '@mui/icons-material/Info';
import TablePagination from '@mui/material/TablePagination';


const tableHeading = [
  {
    id: "orderNo",
    label: "Order No",
    align: "left",
  },
  {
    id: "qty",
    label: "Qty",
    align: "left",
  },
  {
    id: "billingDate",
    label: "Billing Date",
    align: "left",
  },
  {
    id: "billingAddress",
    label: "Billing Address",
    align: "left",
  },
  {
    id: "amount",
    label: "Amount",
    align: "left",
  },
  {
    id: "method",
    label: "Payment Method",
    align: "left",
  },
  {
    id: "paymemtstatus",
    label: "Payment Status",
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
]; // =============================================================================

OrderList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function OrderList({ props }) {
  const router = useRouter();
  const { mutate } = useSWRConfig()
  const { data: session,status} = useSession();
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [useScrollFlag,setUseScrollFlag] = useState(false);
  const [orderList, setOrderList] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search,setSearch] = useState('');
  const [searchText,setSearchText] = useState('');

  /// Pagination restore from router
  const { pageIndexRouter, scrollPosition, rowsPerPageRouter } = router.query;
  useEffect(() => {
    if(pageIndexRouter){
      setRowsPerPage(parseInt(rowsPerPageRouter));
      setPageIndex(parseInt(router.query.pageIndexRouter));
      setUseScrollFlag(true);
      setUseSwrFlag(true);
    }
  }, [scrollPosition,pageIndexRouter,rowsPerPageRouter]);
  /// END

  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllOrder?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data){
    setOrderList(data);setUseSwrFlag(false);
    if(scrollPosition && useScrollFlag){
      setTimeout(() => {window.scrollTo(0, parseInt(scrollPosition));}, 0);
      setUseScrollFlag(false);
    }
  }

  const handleChange = (event, value) => {
    setPageIndex(value);
    setUseSwrFlag(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageIndex(0);
    setUseSwrFlag(true);
  };
  const getCurrentScrollPosition = () => {
    return window.pageYOffset;
  }

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const {
    order,
    orderBy,
    selected,
    // rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: orderList?orderList['results']:[],
    rowsPerPage: rowsPerPage,
    defaultSort: "purchaseDate",
    defaultOrder: "desc",
  });
  return (
    <Box py={4}>
      <FlexBox flexWrap="wrap">
        <H3 mb={2}>Orders</H3> 
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Timestamp Filter Format:</Typography>
            <b>{'YYYY-MM-DD'}</b> <u>{'e.g. 2023-04-16'}</u>.
          </React.Fragment>
        }
      >
        <InfoIcon/>
      </HtmlTooltip>
      </FlexBox>

      <SearchArea
        handleSearch={(event) => {setSearchText(event.target.value);}}
        handleSearchClick = {(event) => { setSearch(searchText);setUseSwrFlag(true);}}
        handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true);}}
        buttonText="Create Order"
        handleBtnClick={() => {router.push('/admin/schools/create');}}
        searchPlaceholder="Search Order..."
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
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={orderList?orderList['results'].length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Order Found
        </TableCell>
      </TableRow>
    ):
                (filteredList.map((order, index) => (
                  <OrderRow order={order} key={index} pageIndex={pageIndex} getCurrentScrollPosition={getCurrentScrollPosition} rowsPerPageRouter={rowsPerPage} />
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <Stack alignItems="center" my={4}>
        <Pagination count={orderList?Math.ceil(orderList['count']/20):''} variant="outlined" color="primary" onChange={handleChange} />
        <Span color="grey.600" style={{marginTop:'1%'}}>Showing {orderList?((pageIndex-1)*20)+1:''}-{orderList?((pageIndex-1)*20) + orderList['results'].length:''} of {orderList?orderList['count']:''} Orders</Span>
        </Stack> */}
        <TablePagination
          component="div"
          count={orderList?orderList['count']:''}
          page={pageIndex}
          onPageChange={handleChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}

OrderList.auth = true