/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import BookingCard from "examples/Cards/BookingCard";

// Anaytics dashboard components
import TripsByCountry from "layouts/dashboards/trips/components/SalesByCountry";

// Data
import reportsBarChartData from "layouts/dashboards/trips/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboards/trips/data/reportsLineChartData";

// Images
import booking1 from "assets/images/products/product-1-min.jpg";
import booking2 from "assets/images/products/product-2-min.jpg";
import booking3 from "assets/images/products/product-3-min.jpg";
import { useEstadisticasPaseo, IDataEstadisticaDePaseos } from "hooks/useEstadisticasPaseo";

import { useState, useEffect } from "react";

function Trips(): JSX.Element {
  const { obtenerDataEstadisticaDePaseos } = useEstadisticasPaseo();
  const [dataEstadisticaDePaseos, setDataEstadisticaDePaseos] = useState<IDataEstadisticaDePaseos>();

  useEffect(() => {
    (async () => {
      setDataEstadisticaDePaseos(await obtenerDataEstadisticaDePaseos());
    })();
  }, [])

  // Action buttons for the BookingCard
  const actionButtons = (
    <>
      <Tooltip title="Refresh" placement="bottom">
        <MDTypography
          variant="body1"
          color="primary"
          lineHeight={1}
          sx={{ cursor: "pointer", mx: 3 }}
        >
          <Icon color="inherit">refresh</Icon>
        </MDTypography>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">edit</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container>
          <TripsByCountry
            tripsByCountry={dataEstadisticaDePaseos?.tripsByCountry}
            tripsLocations={dataEstadisticaDePaseos?.tripsLocations}
            topTrips={dataEstadisticaDePaseos?.topTrips}
          />
        </Grid>
        <MDBox mt={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Trips planned per day"
                  description="Number of trips planned per day of the week"
                  date="historical data"
                  chart={dataEstadisticaDePaseos?.tripsPerDay}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Trips per month"
                  description="Number of trips planned per month of the year"
                  date="historical data"
                  chart={dataEstadisticaDePaseos?.tripsPlannedPerMonth}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Trips created per month"
                  description="Number of trips created per month of the year"
                  date="historical data"
                  chart={dataEstadisticaDePaseos?.tripsCreatedPerMonth}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1.5}>
          <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="work"
                  title="Total trips"
                  count={dataEstadisticaDePaseos?.totalsTrips?.trips}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="swipeLeft"
                  title="Manually created trips"
                  count={dataEstadisticaDePaseos?.totalsTrips?.noRandomTrips}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="cached"
                  title="Random created trips"
                  count={dataEstadisticaDePaseos?.totalsTrips?.randomTrips}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="restaurant"
                  title="Total restaurants"
                  count={dataEstadisticaDePaseos?.totalsTrips?.restaurants}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="kayaking"
                  title="Total attractions"
                  count={dataEstadisticaDePaseos?.totalsTrips?.attractions}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="place"
                  title="Total countries"
                  count={dataEstadisticaDePaseos?.totalsTrips?.countries}
                />
              </MDBox>
            </Grid>            
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Trips;
