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

import { ReactNode } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

// Declaring props types for ControllerCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  state?: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  onChange: () => void;
  [key: string]: any;
}

function ControllerCard({ color, state, icon, title, description, onChange }: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card sx={{ height: "100%", overflow: "hidden" }}>
      <MDBox
        p={3}
        height="100%"
        bgColor={state ? color : "white"}
        variant="gradient"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={({ palette: { background } }: { palette: any }) => ({
          background: darkMode && !state && background.card,
        })}
      >
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          lineHeight={1}
        >
          <MDTypography variant="body2" color={state ? "white" : "text"}>
            {state ? "On" : "Off"}
          </MDTypography>
          <MDBox mt={-0.5} mr={-1.5}>
            <Switch checked={state} onChange={onChange} />
          </MDBox>
        </MDBox>
        {icon}
        <MDBox mt={1} lineHeight={1}>
          <MDTypography variant="body2" color={state ? "white" : "text"} textTransform="capitalize">
            {title}
          </MDTypography>
          {description ? (
            <MDTypography variant="caption" color={state ? "white" : "text"}>
              {description}
            </MDTypography>
          ) : null}
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Declaring default props for ControllerCard
ControllerCard.defaultProps = {
  color: "info",
  state: false,
  description: "",
};

export default ControllerCard;
