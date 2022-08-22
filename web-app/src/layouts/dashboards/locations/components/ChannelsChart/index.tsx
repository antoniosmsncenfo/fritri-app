// @mui material components
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadgeDot from "components/MDBadgeDot";
import PieChart from "examples/Charts/PieChart";

// Data
import channelChartData from "layouts/dashboards/locations/components/ChannelsChart/data";

// Material Dashboard 2 PRO React TS contexts
import { useMaterialUIController } from "context";
import { ILocationsPieChartSeries } from "hooks/useEstadisticasDestino";

function ChannelsChart(locationsChartSeries:ILocationsPieChartSeries): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6">Locations</MDTypography>        
      </MDBox>
      <MDBox mt={3}>
        <Grid container alignItems="center">
          <Grid item xs={7}>
            <PieChart chart={locationsChartSeries} height="10rem" />
          </Grid>
          <Grid item xs={5}>
            <MDBox pr={1}>
              <MDBox mb={1}>
                <MDBadgeDot color="info" size="sm" badgeContent="Destinations" />
              </MDBox>
              <MDBox mb={1}>
                <MDBadgeDot color="primary" size="sm" badgeContent="Restaurants" />
              </MDBox>
              <MDBox mb={1}>
                <MDBadgeDot color="dark" size="sm" badgeContent="Attractions" />
              </MDBox>             
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox
        pt={4}
        pb={2}
        px={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        mt="auto"
      >
        <MDBox width={{ xs: "100%", }} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
          Shows the proportion of results returned in searches for both destinations, restaurants and tourist attractions.
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChannelsChart;
