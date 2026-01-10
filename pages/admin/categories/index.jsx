import { Box, Card, Stack, Table, TableContainer, Pagination,TableRow,TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import SearchArea from "components/dashboard/SearchArea";
import TableHeader from "components/data-table/TableHeader";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3,Span } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { CategoryRow } from "pages-sections/admin";
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
    id: "slug",
    label: "Slug",
    align: "left",
  },
  {
    id: "icon",
    label: "Icon",
    align: "left",
  },
  {
    id: "parent",
    label: "Parent",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; // =============================================================================

CategoryList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function CategoryList(props) {
  const router = useRouter();
  const { mutate } = useSWRConfig()
  const { data: session, status } = useSession()
  const [useSwrFlag,setUseSwrFlag] = useState(true);
  const [useScrollFlag,setUseScrollFlag] = useState(false);
  const [categoryList, setCategoryList] = useState(null);

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
  const { data, error } = useSWR(useSwrFlag?server_ip+`getAllLocalPaginatedCategories?page=${pageIndex+1}${'&page_size='+rowsPerPage}${search?'&search='+search:''}`:null, fetcher);
  if (error) <p>Loading failed...</p>;
  if (!data) <h1>Loading...</h1>;
  if(useSwrFlag && data && data!=categoryList){
    setCategoryList(data);setUseSwrFlag(false);
    if(scrollPosition && useScrollFlag){
      setTimeout(() => {window.scrollTo(0, parseInt(scrollPosition));}, 0);
      setUseScrollFlag(false);
    }
  }
  const handleChange = (event, value) => {
    setPageIndex(value);
    setUseSwrFlag(true);
  };
  const handleDelete = (id) => {
    deleteCategory(id);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageIndex(0);
    setUseSwrFlag(true);
  };
  const getCurrentScrollPosition = () => {
    return window.pageYOffset;
  }

  async function deleteCategory(id){
    const myNewModel = await axiosInstance
      .post(`${server_ip}deleteCategory`, id, {
          headers: {
            'content-type': 'application/json',
            'Authorization':'Bearer '+session.accessToken
          },
      }).then((res) => {
          if(res.data['ErrorCode']==0 ){
            setUseSwrFlag(true);
            mutate(server_ip+`getAllSchool?page=${pageIndex}&search=${search}`);
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

  const {
    order,
    orderBy,
    selected,
    // rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: categoryList?categoryList['results']:[],
    rowsPerPage: rowsPerPage,
  });
  return (
    <Box py={4}>
      <H3 mb={2}>Categories</H3>

      <SearchArea
        handleSearch={(event) => {setSearchText(event.target.value);}}
        handleSearchClick = {(event) => {setSearch(searchText);setUseSwrFlag(true);}}
        handleClearClick = {() => {setSearch('');setSearchText('');setUseSwrFlag(true)}}
        buttonText="Add Category"
        handleBtnClick={() => {router.push('/admin/categories/create');}}
        searchPlaceholder="Search Category..."
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
                rowCount={categoryList?categoryList['results'].length:0}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>

              {filteredList.length === 0 ? (
      <TableRow>
        <TableCell colSpan={2}>
         No Category Found
        </TableCell>
      </TableRow>
    ):



                (filteredList.map((category, index) => (
                  <CategoryRow
                    item={category}
                    key={index}
                    selected={selected}
                    handleDeleteCategory = {handleDelete}
                    pageIndex={pageIndex} 
                    getCurrentScrollPosition={getCurrentScrollPosition} 
                    rowsPerPageRouter={rowsPerPage}
                  />
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* <Stack alignItems="center" my={4}>
        <Pagination count={categoryList?Math.ceil(categoryList['count']/20):''} variant="outlined" color="primary" onChange={handleChange} />
        <Span color="grey.600" style={{marginTop:'1%'}}>Showing {categoryList?((pageIndex-1)*20)+1:''}-{categoryList?((pageIndex-1)*20) + categoryList['results'].length:''} of {categoryList?categoryList['count']:''} Categories</Span>
        </Stack> */}
        <TablePagination
          component="div"
          count={categoryList?categoryList['count']:''}
          page={pageIndex}
          onPageChange={handleChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
}

CategoryList.auth = true
