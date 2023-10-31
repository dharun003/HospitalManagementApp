import React, { useState, useEffect } from "react";
import { Button, Input, message, Row, Col, Space, Select, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserEmail } from "./UserContext";
//import { GLOBAL_CONSTANT } from './signin';
//export const GLOBAL_CONSTANT = auth.currentUser.email;


const LandingPage = () => {
  const { Option } = Select;
  const userName = useUserEmail().userEmail;
  const [searchType, setSearchType] = useState("phoneNumber");
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  let navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    navigate("/", { replace: true });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={()=>navigate("/patientDetails", {state: {patient: record}})}>View</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function fetchAllPatients() {
      const patientsList = await getAllPatients();
      setPatients(patientsList);
      setFilteredPatients(patientsList);
    }

    fetchAllPatients();
  }, []);

  async function getAllPatients() {
    console.log('Landing page log',userName);
    const querySnapshot = await getDocs(collection(db, "patients_" + userName));
    
    const patientsList = querySnapshot.docs.map((doc) => ({
      key: doc.id,
      name: doc.get("name"),
      phoneNumber: doc.get("phoneNumber"),
      gender: doc.get("gender"),
      address: doc.get("address"),
    }));
    return patientsList;
  }

  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredPatients(patients);
      return;
    }

    const filteredList = patients.filter((patient) =>
      patient[searchType].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filteredList);
  };

  return (
    <Row type="flex" justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col span={6}>
        <Space direction="vertical" style={{ width: "100%", height: "100%", justifyContent: "center" }}>
          <Row type="flex" justify="center" align="middle">
            <Select defaultValue="phoneNumber" style={{ width: 120 }} onChange={(event) => setSearchType(event)}>
              <Option value="phoneNumber">Phone Number</Option>
              <Option value="name">Name</Option>
            </Select>
            <Input style={{ width: "70%" }} onChange={(event) => setQuery(event.target.value)} defaultValue="" />
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Button>
              <Link to="/addNewPatient">Add Patient</Link>
            </Button>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Button>
              <Link to="/MedicinesPage">Medicines</Link>
            </Button>
          </Row>
          <Row type="flex" justify="center" align="middle">
          
          <Button onClick={() => logout()}>Sign Out</Button>
          
            
          </Row>
        </Space>
      </Col>
      <Col span={18}>
        <Table columns={columns} dataSource={filteredPatients} />
      </Col>
    </Row>
  );
};

export default LandingPage;

