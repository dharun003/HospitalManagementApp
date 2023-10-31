import * as React from "react";
import { Button, Input, message } from "antd";
import { Row } from "antd";
import { Select, Space } from "antd";
import { db } from "../utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { useUserEmail } from "./UserContext";



async function createPatient(db, name, gender, address, phoneNumber, userName) {
  // Add a new document in collection
  return await setDoc(doc(db, "patients_" + userName, phoneNumber), {
    name: name.toLowerCase(),
    address: address,
    gender: gender,
    phoneNumber: phoneNumber,
  });
}

const AddNewPatient = () => {
  const { Option } = Select;
  const { TextArea } = Input;
  const navigate = useNavigate();
  const userName = useUserEmail().userEmail;

  const [name, setName] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [gender, setGender] = useState("M");
  const [address, setAddress] = useState("");
  

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Space
        direction="vertical"
        style={{ height: "100%", justifyContent: "center" }}
      >
        {/*Phone Number*/}
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Phone Number</span>
          <Input
            style={{ width: "50%" }}
            onChange={(event) => setNumber(event.target.value)}
            defaultValue=""
          />
        </Row>

        {/*Name*/}
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Name</span>

          <Input
            style={{ width: "80%" }}
            onChange={(event) => setName(event.target.value)}
            defaultValue=""
          />
        </Row>

        {/*Gender*/}
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Gender</span>

          <Select
            defaultValue="M"
            style={{ width: 120 }}
            onChange={(event) => setGender(event)}
          >
            <Option value="M">M</Option>
            <Option value="F">F</Option>
          </Select>
        </Row>

        {/*Address*/}
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Address</span>
          <TextArea
            rows={4}
            style={{ width: "80%" }}
            onChange={(event) => setAddress(event.target.value)}
            defaultValue=""
          />
        </Row>

        {/*Create*/}
        <Row type="flex" justify="center" align="middle">
          <Button
            type="primary"
            onClick={async () => {
              if (phoneNumber.length > 0 && name.length > 0) {
                createPatient(db, name, gender, address, phoneNumber, userName)
                  .then((result) => {
                    console.log(result);
                    message.success("New patient added");
                    navigate("/patientDetails", {
                      state: {
                        patient: {
                          name: name,
                          phoneNumber: phoneNumber,
                          gender: gender,
                          address: address,
                        },
                      },
                      replace: true,
                    });
                  })
                  .catch((error) => {
                    message.error("No permission");
                  });
              } else {
                message.warn("Enter valid phone number and name");
              }
            }}
          >
            Create
          </Button>
        </Row>

        {/*Search*/}
        <Row type="flex" justify="center" align="middle">
          <Button
            onClick={() => {
              navigate("/", { replace: true });
            }}
          >
            Back
          </Button>
        </Row>
      </Space>
    </Row>
  );
};

export default AddNewPatient;
