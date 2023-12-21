import { React, useEffect, useState } from "react";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Your data
// const data = [
//   {
//     _id: "6581bc494178d3294cfc90f6",
//     id: "f96ff1f7-c0ef-4fa2-a444-2f326a3df48f",
//     firstName: "Vikki",
//     lastName: "Elrick",
//     age: 45,
//     gender: "Female",
//     city: "Huanggexi",
//     products: '["cellular"]',
//     topic: "complaint",
//     __v: 0,
//   },
//   // ... (add other data objects)
// ];

export default function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SOCKET_LINK}/api/calls`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const columns = [
    { Header: "First Name", accessor: "firstName", align: "left" },
    { Header: "Last Name", accessor: "lastName", align: "left" },
    { Header: "Age", accessor: "age", align: "center" },
    { Header: "Gender", accessor: "gender", align: "center" },
    { Header: "City", accessor: "city", align: "center" },
    { Header: "Products", accessor: "products", align: "center" },
    { Header: "Topic", accessor: "topic", align: "center" },
    { Header: "Call Start Time", accessor: "callStartTime", align: "center" },
  ];

  const rows = data.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    age: item.age,
    gender: item.gender,
    city: item.city,
    products: JSON.parse(item.products),
    topic: item.topic,
    callStartTime: item.callStartTime,
  }));

  // const Project = ({ name }) => <>{name}</>;

  // const Progress = ({ color, value }) => <>{value}%</>;

  return {
    columns,
    rows: rows.map((row, index) => ({
      ...row,
      action: (
        <Icon key={index} fontSize="small">
          more_vert
        </Icon>
      ),
    })),
  };
}
