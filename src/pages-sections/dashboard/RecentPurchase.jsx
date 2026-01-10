import { Button, Card } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import { H5 } from "components/Typography";
import React from "react";
import DataListTable from "./table"; // table column list
import Link from "next/link";

const tableHeading = [
  {
    id: "product",
    label: "Product",
    alignRight: false,
  },
  {
    id: "orderId",
    label: "Total Quantity Sold",
    alignRight: false,
  },
 
  {
    id: "payment",
    label: "Total Orders",
    alignRight: false,
  },
  {
    id: "Sale Price",
    label: "Sale Price",
    alignCenter: true,
  },
]; // ===================================================

// ===================================================
const RecentPurchase = (data) => {
  return (
    <Card>
      <FlexBetween px={3} py={2.5}>
        <H5>Hot Sales</H5>

        <Button size="small" color="info" variant="outlined">
        <Link href='/admin/orders'>
<a href="">
          All Orders
          </a>
          </Link>
        </Button>
      </FlexBetween>

      <DataListTable
        data={data}
        tableHeading={tableHeading}
        type="RECENT_PURCHASE"
      />
    </Card>
  );
};

export default RecentPurchase;
