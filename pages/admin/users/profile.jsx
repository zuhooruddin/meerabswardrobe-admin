import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import { AdminProfileForm } from "pages-sections/admin";
import React, {useState} from "react";
import api from "utils/api/dashboard";
import { getSession } from "next-auth/react"

const ProfileAdmin= (props) => {

  return (
    <Box py={4}>
      <H3 mb={2}>User Profile</H3>

      <AdminProfileForm
        adminDetail = {props.data[0]}
      />
    </Box>
   
  );
}; // =============================================================================

ProfileAdmin.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

export async function getServerSideProps(context) {
  var data = [];
  var sessionValue = await getSession(context);
  if (!sessionValue) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  const adminId = sessionValue.user['id'];
  data = await api.getAdmin(adminId,sessionValue.accessToken);

  return { props: { data:data } }
};

export default ProfileAdmin;

ProfileAdmin.auth = true
