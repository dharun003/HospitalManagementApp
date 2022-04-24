import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { Button, Row, List } from "antd";

const PatientsList = () => {

  const location = useLocation();
  let navigate = useNavigate();

  let x = location.state.patients;
  console.log(x);
  
  return <Row type="flex"
  justify="space-around"
  align="middle"
  style={{ minHeight: "100vh" }}>
            <List
          dataSource={x}
          renderItem={(item) => (
            <List.Item key={item.phoneNumber}>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name}</a>}
                style={{ width: 300 }}
                description={item.email}
              />
              <div color="grey">
                <p>Phone Number: {item.phoneNumber}</p>
                <p>Gender: {item.gender}</p>
                <p>Address: {item.address}</p>
                <Button onClick={()=>navigate("/patientDetails", {state: {patient: item}})}>View</Button>
              </div>
            </List.Item>
          )}
        />
  </Row>;
};

export default PatientsList;
