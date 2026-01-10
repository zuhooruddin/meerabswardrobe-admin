import { Box } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { H3 } from "components/Typography";
import React, {useState} from "react";
import { SyncCategoryForm,SyncItemForm } from "pages-sections/admin";


const Sync = (props) => {
  
  return (
    <Box py={4}>
      <H3 mb={2}>Synchronization Process for Categories / Items</H3>
      <SyncCategoryForm />
      <SyncItemForm />
    </Box>
   
  );
}; // =============================================================================

Sync.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================


export default Sync;

Sync.auth = true
