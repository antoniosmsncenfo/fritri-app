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

// @fullcalendar components
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for Calendar
import CalendarRoot from "examples/Calendar/CalendarRoot";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";

// Declaring props types for the Calender
interface Props {
  header?: {
    title?: string;
    date?: string;
  };
  [key: string]: any;
}

function Calendar({ header, ...rest }: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const validClassNames = [
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ];

  const events = rest.events
    ? rest.events.map((el: any) => ({
        ...el,
        className: validClassNames.find((item) => item === el.className)
          ? `event-${el.className}`
          : "event-info",
      }))
    : [];

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={header.title || header.date ? 2 : 0} px={2} lineHeight={1}>
        {header.title ? (
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {header.title}
          </MDTypography>
        ) : null}
        {header.date ? (
          <MDTypography component="p" variant="button" color="text" fontWeight="regular">
            {header.date}
          </MDTypography>
        ) : null}
      </MDBox>
      <CalendarRoot p={2} ownerState={{ darkMode }}>
        <FullCalendar
          {...rest}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={events}
          height="100%"
        />
      </CalendarRoot>
    </Card>
  );
}

// Declaring default props for Calendar
Calendar.defaultProps = {
  header: {
    title: "",
    date: "",
  },
};

export default Calendar;
