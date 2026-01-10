import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import ProductSearchArea from "components/dashboard/ProductSearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { ProductRow } from "pages-sections/admin";
import React from "react";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import axios from "axios";
import {server_ip} from "utils/backend_server_ip.jsx"
import { useSession } from "next-auth/react";
import TablePagination from '@mui/material/TablePagination';
import { useRouter } from 'next/router'

const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "manufacturer",
    label: "Manufacturer",
    align: "left",
  },
  {
    id: "salePrice",
    label: "Sale Price",
    align: "left",
  },
  {
    id: "stock",
    label: "Stock",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; // =============================================================================

ProductList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function ProductList(props) {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [useScrollFlag,setUseScrollFlag] = useState(false);
  const [productList, setProductList] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search,setSearch] = useState('');
  const [searchAuthor,setSearchAuthor] = useState('');
  const [searchManufacturer,setSearchManufacturer] = useState('');
  const [searchText,setSearchText] = useState('');
  const [searchAuthorText,setSearchAuthorText] = useState('');
  const [searchManufacturerText,setSearchManufacturerText] = useState('');
  
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

  // For Pagination 
  const fetcher = async (url) => await axios.get(url,{headers:{"Authorization":'Bearer '+session.accessToken}}).then((res) => res.data);
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllPaginatedItems?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}${searchAuthor?'&author='+searchAuthor:''}${searchManufacturer?'&manufacturer='+searchManufacturer:''}`:null, fetcher);
  if(data){
    console.log("Data",data)
  }
  
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data && data!=productList){
    setProductList(data);setUseSwrFlag(false);
    if(scrollPosition && useScrollFlag){
      setTimeout(() => {window.scrollTo(0, parseInt(scrollPosition));}, 0);
      setUseScrollFlag(false);
    }
  }

  const handleChange = (event, newPage) => {
    setPageIndex(newPage);
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

  const {
    order,
    orderBy,
    selected,
    // rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: productList?productList['results']:[],
    rowsPerPage: rowsPerPage,
  });
  return (
    <Box py={4}>
      <H3 mb={2}>Product List</H3>

      <ProductSearchArea
        handleSearch={(event) => {setSearchText(event.target.value);}}
        handleSearchAuthor={(event) => {setSearchAuthorText(event.target.value);}}
        handleSearchManufacturer={(event) => {setSearchManufacturerText(event.target.value);}}
        handleSearchClick = {(event) => {setSearch(searchText);setSearchAuthor(searchAuthorText.toUpperCase());setSearchManufacturer(searchManufacturerText.toUpperCase());setUseSwrFlag(true);}}
        handleClearClick = {() => {setSearch('');setSearchText('');setSearchAuthor('');setSearchAuthorText('');setSearchManufacturer('');setSearchManufacturerText('');setUseSwrFlag(true);}}
        addButton = {false}
        buttonText="Add Product"
        handleBtnClick={() => {}}
        searchPlaceholder="Search Product..."
        authorPlaceholder="Search Author..."
        manufacturerPlaceholder="Search Manufacturer..."
        searchText      = {searchText}
        searchAuthorText = {searchAuthorText}
        searchManufacturerText = {searchManufacturerText}
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
                rowCount={productList?productList['results'].length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Product Found
        </TableCell>
      </TableRow>
    ):
                (filteredList.map((product, index) => (
                  <ProductRow product={product} key={index} pageIndex={pageIndex} getCurrentScrollPosition={getCurrentScrollPosition} rowsPerPageRouter={rowsPerPage} />
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <Stack alignItems="center" my={4}>
        <Pagination count={productList?Math.ceil(productList['count']/20):''} variant="outlined" color="primary" onChange={handleChange} />
        <Span color="grey.600" style={{marginTop:'1%'}}>Showing {productList?((pageIndex-1)*20)+1:''}-{productList?((pageIndex-1)*20) + productList['results'].length:''} of {productList?productList['count']:''} Products</Span>
        </Stack> */}
        <TablePagination
          component="div"
          count={productList?productList['count']:''}
          page={pageIndex}
          onPageChange={handleChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}

ProductList.auth = true