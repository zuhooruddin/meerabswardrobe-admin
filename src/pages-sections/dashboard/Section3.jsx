import { Box, Grid, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";
import Card2 from "./Card2";
import {
  marketShareChartOptions,
  productShareChartOptions,
  totalOrderChartOptions,
  weeklyChartOptions,
} from "./chartsOptions"; // apext chart instance

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Section3 = ({weeklysaleitem,weeklysale,monthlysaleitem,monthlysale,weeklyorder}) => {
  const theme = useTheme(); // weekly chart series

 
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xl={3} lg={3} md={6} xs={12}>
          <Card2 title="Weekly Sales"  amount={"PKR  "+weeklysale && weeklysale?weeklysale:0}>
            {/* <ReactApexChart
              type="bar"
              height={100}
              series={weeklysale}
              options={weeklyChartOptions(theme)}
            /> */}
          </Card2>
        </Grid>
        <Grid item xl={3} lg={3} md={6} xs={12}>
  <Card2 title="Weekly Sale Item" amount={weeklysaleitem && weeklysaleitem?weeklysaleitem:0} style={{ position: "relative" }}>
    {/* <ReactApexChart
      height={130}
      series={[weeklysaleitem]}
      type="radialBar"
      options={productShareChartOptions(theme)}
    /> */}
    
    {/* Additional content for this week's total order */}
    <div
      style={{
        fontSize: "10px",
        top:"22px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <p>This Week Total Order: {weeklyorder && weeklyorder?weeklyorder:0}</p>
    </div>
  </Card2>
</Grid>


        <Grid item xl={3} lg={3} md={6} xs={12}>
          <Card2 title="Monthly Sales" amount={"PKR  "+monthlysale &&monthlysale?monthlysale:0}>
            {/* <ReactApexChart
              type="area"
              height={80}
              series={[monthlysale]}
              options={totalOrderChartOptions(theme)}
            /> */}
          </Card2>
        </Grid>

        <Grid item xl={3} lg={3} md={6} xs={12}>
          <Card2 title="Monthly Sale Item"  amount={monthlysaleitem && monthlysaleitem?monthlysaleitem:0}>
            {/* <ReactApexChart
              height={130}
              type="radialBar"
              series={[monthlysaleitem]}
              options={marketShareChartOptions(theme)}
            /> */}
          </Card2>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Section3;
