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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
// socket.io
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Dashboard() {
  const generateCalls = () => {
    // Disable the MDButton
    setDisabled(true);

    // Wait for 10 seconds before enabling the MDButton
    setTimeout(() => {
      setDisabled(false);
    }, 10000);

    fetch(process.env.LAMBDA_CALL_GENERATOR, {
      method: "POST",
    });
  };
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    totalCalls: "0",
    complaints: "0",
    joining: "0",
    service: "0",
    disconnects: "0",
    callsPerHour: new Array(24).fill(0),
  });

  const [callsPerMonth, setCallsPerMonth] = useState(new Array(12).fill(0));
  const [callsPerDayOfTheWeek, setCallsPerDayOfTheWeek] = useState(new Array(7).fill(0));

  const hour_labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  const month_labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const callsPerDayOfTheWeekObject = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: { label: "Sales", data: callsPerDayOfTheWeek },
  };

  const callsPerMonthObject = {
    labels: month_labels,
    datasets: { label: "Calls Per Month", data: callsPerMonth },
  };

  const callsPerHourObject = {
    labels: hour_labels,
    datasets: { label: "Calls Per Hour", data: data.callsPerHour },
  };

  useEffect(() => {
    const socket = io(process.env.SOCKET_LINK || "http://localhost:5000");

    fetch(`${process.env.SOCKET_LINK}/api/calls-per-day`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const index = item._id - 1; // Assuming the _id values start from 1
          callsPerDayOfTheWeek[index] = item.count;
        });
        setCallsPerDayOfTheWeek([...callsPerDayOfTheWeek]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    fetch(`${process.env.SOCKET_LINK}/api/calls-per-month`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const index = item._id - 1; // Assuming the _id values start from 1
          callsPerMonth[index] = item.count;
        });

        // Update the state with the updated `callsPerMonth` array
        setCallsPerMonth([...callsPerMonth]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("callData", (data) => {
      console.log("Received updated data:", data);
      setData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <MDButton
                onClick={generateCalls}
                component="a"
                target="_blank"
                rel="noreferrer"
                variant="gradient"
                fullWidth
                disabled={disabled}
              >
                Generate Calls
              </MDButton>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <p></p>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <p></p>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Service calls"
                count={data.service}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Calls Today"
                count={data.totalCalls}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Complaints"
                count={data.complaints}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="person_add"
                title="Joining"
                count={data.joining}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="store"
                title="Disconnecting calls"
                count={data.disconnects}
                percentage={{
                  color: "fail",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Calls per day of the week"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={callsPerDayOfTheWeekObject}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Calls Per Hour"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={callsPerHourObject}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Calls Per Month"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={callsPerMonthObject}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <></>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview data={data} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
