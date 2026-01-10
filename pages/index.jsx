import { Box, Grid } from "@mui/material";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Analytics from "pages-sections/dashboard/Analytics";
import Card1 from "pages-sections/dashboard/Card1";
import RecentPurchase from "pages-sections/dashboard/RecentPurchase";
import Section3 from "pages-sections/dashboard/Section3";
import StockOutProducts from "pages-sections/dashboard/StockOutProducts";
import WishCard from "pages-sections/dashboard/WishCard";
import api from "utils/api/dashboard"; // =============================================================================

VendorDashboard.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
}; // =============================================================================

// =============================================================================
export default function VendorDashboard(props) {
  const {statistics } = props;

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WishCard data={statistics?.current_month_sale} />
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
         
            <Grid item md={6} sm={6} xs={12} >
              <Card1
              data={statistics ?statistics:{}}
              
              />
              
            </Grid>
       
        </Grid>

        <Grid item xs={12}>
          <Section3
          weeklysaleitem={statistics?.weekly_saleitem}
          weeklysale={statistics?.total_weekly_sale}
          monthlysaleitem={statistics?.monthy_saleitem}
          monthlysale={statistics?.monthly_sales}
          weeklyorder={statistics?.weekly_saleorder}
          
          />
        </Grid>

        {/* <Grid item xs={12}>
          <Analytics />
        </Grid> */}

        <Grid item md={7} xs={12}>
          <RecentPurchase data={statistics?.mostsold_item} />
        </Grid>

        <Grid item md={5} xs={12}>
          <StockOutProducts data={statistics?.stock_items} />
        </Grid>
      </Grid>
    </Box>
  );
}
export const getStaticProps = async () => {
  try {
    const statistics = await api.getAllStatistics();
    return {
      props: {
        statistics,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error.message);

    // You can either return fallback props, or redirect, or set a notFound flag
    return {
      props: {
        statistics: {}, // or some default mock object
        error: 'Failed to fetch statistics'
      },
      // Optionally: revalidate every 60 seconds if using ISR
      // revalidate: 60,
    };
  }
};
VendorDashboard.auth = true

