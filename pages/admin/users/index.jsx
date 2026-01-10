import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import useMuiTable from "hooks/useMuiTable";
import { AdminRow } from "pages-sections/admin";
import React from "react";
import { toast } from 'react-toastify';
import { getSession } from "next-auth/react"
import api from "utils/api/dashboard"; // table column list

const tableHeading = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "mobile",
    label: "Mobile #",
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    align: "left",
  },
  {
    id: "role",
    label: "Role",
    align: "left",
  },
 
  {
    id: "action",
    label: "Action",
    align: "center",
  },
]; // =============================================================================

UserList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function UserList({ admins,ErrorCode,ErrorMsg }) {
  if(ErrorCode==1){
    toast.error(ErrorMsg, {
      position: toast.POSITION.TOP_RIGHT
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
    listData: admins,
  });

  const handleDeleteAdmin = () => {
  };
 

  return (
    <Box py={4}>
      <H3 mb={2}>Admins</H3>
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
                rowCount={admins.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredList.map((customer, index) => (
                  <AdminRow customer={customer} key={index} handleDeleteAdmin={handleDeleteAdmin} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(admins.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
export async function getServerSideProps(context) {
  var sessionValue = await getSession(context);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  var admins    = []
  var ErrorCode = 1
  var ErrorMsg  = ''
  
  if(sessionValue){
    admins = await api.getAllAdmin(sessionValue.accessToken).then((response) => {
    if(response.status==200){
      ErrorCode = 0
    }
    else{
      ErrorCode = 1
      ErrorMsg  = 'Request not fulfilled! Kindly contact Administrator'
      return []
    }
    return response.data
  }).catch((error) => {
    if (error.response) {
      //// if api not found or server responded with some error codes e.g. 404
      ErrorCode = 1
      ErrorMsg  = 'Request not fulfilled! Kindly contact Administrator'
      return []
    } else if (error.request) {
      /// Network error api call not reached on server
      ErrorCode = 1
      ErrorMsg  = 'Network Error! Kindly contact Administrator'
      return []
    } else {
      ErrorCode = 1
      ErrorMsg  = 'Request not fulfilled! Kindly contact Administrator'
      return []
    }
  });
}

  return {
    props: {
      admins,
      ErrorCode,
      ErrorMsg

    },
  };
};
UserList.auth = true