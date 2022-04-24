import * as React from "react";
import { Button, Input, message } from "antd";
import { Row } from "antd";
import { Select, Space } from "antd";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../utils/firebase";

async function getPatients(db, searchType, queryText) {
  // Create a query against the collection.
  let q = null;
  if (searchType === "phoneNumber") {
    q = query(collection(db, "patients"), where(searchType, "==", queryText));
  } else {
    q = query(collection(db, "patients"), where(searchType, ">=", queryText));
  }
  const querySnapshot = await getDocs(q);
  const patientsList = querySnapshot.docs.map((doc) => ({
    name: doc.get("name"),
    phoneNumber: doc.get("phoneNumber"),
    gender: doc.get("gender"),
    address: doc.get("address"),
  }));
  return patientsList;
}

const LandingPage = () => {
  const { Option } = Select;

  const [searchType, setSearchType] = useState("phoneNumber");
  const [query, setQuery] = useState("");

  let navigate = useNavigate();

  const logout = () => {
    auth.signOut();
  };

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Space
        direction="vertical"
        style={{ width: "100%", height: "100%", justifyContent: "center" }}
      >
        <Row type="flex" justify="center" align="middle">
          <Select
            defaultValue="phoneNumber"
            style={{ width: 120 }}
            onChange={(event) => setSearchType(event)}
          >
            <Option value="phoneNumber">Phone Number</Option>
            <Option value="name">Name</Option>
          </Select>
          <Input
            style={{ width: "20%" }}
            onChange={(event) => setQuery(event.target.value)}
            defaultValue=""
          />
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Button
            type="primary"
            onClick={async () => {
              console.log(query);

              getPatients(db, searchType, query).then((list)=>{console.log(list);
              if (list.length === 0) {
                message.warn("No such patient");
              } else {
                navigate("/patientsList", { state: { patients: list } });
              }
              }).catch((err)=>{
                console.log("No permission");
                message.error("No permission");
              });
            }}
          >
            Search
          </Button>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Button>
            <Link to="/addNewPatient">Add Patient</Link>
          </Button>
        </Row>
        <Row type="flex" justify="center" align="middle">
          <Button
            onClick={() => {
              logout();
            }}
          >
            Sign Out
          </Button>
        </Row>
      </Space>
    </Row>
  );
};

export default LandingPage;
