/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { object } from "prop-types";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// Material Dashboard 2 React example components
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
function OrdersOverview({ data }) {
  //create pieData based on the object
  const pieData = [
    { name: "Complaints", value: Number(data.complaints), color: "orange" },
    { name: "Joining", value: Number(data.joining), color: "green" },
    { name: "Service", value: Number(data.service), color: "blue" },
    { name: "Disconnects", value: Number(data.disconnects), color: "red" },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Calls overview
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            nameKey="name"
            data={pieData} // Replace 'yourData' with the actual data for the pie chart
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {/* Provide the colors for each section of the pie chart */}
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </MDBox>
    </Card>
  );
}
OrdersOverview.propTypes = {
  data: PropTypes.shape({
    complaints: PropTypes.string.isRequired,
    joining: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    disconnects: PropTypes.string.isRequired,
  }).isRequired,
};
export default OrdersOverview;
