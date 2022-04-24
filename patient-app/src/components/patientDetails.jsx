import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { Modal, Button, Card, DatePicker, Input, Row, message, Popconfirm } from "antd";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import { List } from "antd";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { collection, query, where, getDocs, arrayRemove, deleteDoc } from "firebase/firestore";
import moment from "moment";

const PatientDetails = () => {
  const { TextArea } = Input;

  //To add visit
  const [visits, setVisits] = useState([]);
  const [date, setDate] = useState("");
  const [problem, setProblem] = useState("");
  const [treatment, setTreatment] = useState("");
  const [nextAppointment, setAppointment] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  let x = location.state.patient;

  //To load patient details
  const [phoneNumber, setPhoneNumber] = useState(x.phoneNumber);
  const [address, setAddress] = useState(x.address);
  const [name, setName] = useState(x.name);

  //To handle modals
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    console.log(moment().format("DD-MM-YYYY"));
    setConfirmLoading(true);

    const documentRef = doc(db, "patients", x.phoneNumber);

    updateDoc(documentRef, {
      visits: arrayUnion({
        date: date,
        problem: problem,
        treatment: treatment,
        nextAppointment: nextAppointment,
      }),
    })
      .then(() => {
        setVisible(false);
        setConfirmLoading(false);
        loadMoreData();
      })
      .catch(() => {});
  };

  const VisitDelete = async (date, problem, treatment, appointment) => {

    let q = query(
      collection(db, "patients"),
      where("phoneNumber", "==", phoneNumber)
    );

    const querySnapshot = await getDocs(q);
    let patientDoc = null;
    querySnapshot.docs.map((doc) => {
      patientDoc = doc;
    });

    const documentRef = doc(db, "patients", patientDoc.id);
    console.log(patientDoc.id);

    updateDoc(documentRef, {
      visits: arrayRemove({
        date: date,
        problem: problem,
        treatment: treatment,
        nextAppointment: appointment,
      }),
    })
      .then(() => {
        setVisible(false);
        setConfirmLoading(false);
        loadMoreData();
        message.success("Visit deleted");
      })
      .catch(() => {
        message.error("Error");
      });
  };

  const PatientDelete = async () => {

    await deleteDoc(doc(db, "patients", x.phoneNumber));

    navigate("/",{replace:true});
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const loadMoreData = () => {
    
    let q = query(
      collection(db, "patients"),
      where("phoneNumber", "==", x.phoneNumber)
    );

    getDocs(q).then((querySnapshot)=>{
      let patientDoc = null;
    querySnapshot.docs.map((doc) => {
      patientDoc = doc;
    });
  
      const docRef = doc(db, "patients", patientDoc.id);
  
      getDoc(docRef)
        .then((doc) => {
          setName(doc.get("name"));
          setPhoneNumber(doc.get("phoneNumber"));
          setAddress(doc.get("address"));
          setVisits(doc.get("visits").reverse());
        })
        .catch(() => {});
    }).catch(()=>{});
    
  };

  useEffect(() => {
    loadMoreData();
  });

  return (
    <Row
      type="flex"
      justify="space-around"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Card title={name} style={{ width: 300 }} extra={<Popconfirm
                  title="Are you sure to delete this visit?"
                  onConfirm={()=>{PatientDelete()}}
                  onVisibleChange={() => console.log('visible change')}
                >
                  <Button type="primary" danger>Delete</Button>
                </Popconfirm>}>
        <p>Phone number: {phoneNumber}</p>
        <p>Address: {address}</p>
        <p>Gender: {x.gender}</p>
      </Card>
      <Button type="primary" onClick={showModal}>
        Add visit
      </Button>
      <Button onClick={() => navigate("/", { replace: true })}>
        Search patient
      </Button>
      <Button type="dashed" onClick={() => navigate(-1)}>
        Go back
      </Button>

      {/* Enter visit details */}
      <Modal
        title="Enter visit details"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Problem</span>
          <TextArea
            rows={4}
            style={{ width: "80%" }}
            onChange={(event) => setProblem(event.target.value)}
            defaultValue=""
          />
        </Row>
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Treatment</span>
          <TextArea
            rows={4}
            style={{ width: "80%" }}
            onChange={(event) => setTreatment(event.target.value)}
            defaultValue=""
          />
        </Row>
        <Row align="start" direction="horizontal" justify="space-between">
          <span>Next Appointment</span>
          <DatePicker
          format="DD-MM-YYYY"
            onChange={(date, dateString) => {
              setAppointment(dateString);
              setDate(moment().format("DD-MM-YYYY"));
            }}
          />
        </Row>
      </Modal>

      {/* Visits List */}
      <div
        id="scrollableDiv"
        style={{
          height: 500,
          width: 800,
          overflow: "auto",
          padding: "0 16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <List
          dataSource={visits}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.date}</a>}
              />
              <div>
                <p>Problem: {item.problem}</p>
                <p>Treatment: {item.treatment}</p>
                <p>Next Appointment: {item.nextAppointment}</p>
                <Popconfirm
                  title="Are you sure to delete this visit?"
                  onConfirm={()=>{VisitDelete(item.date,item.problem,item.treatment,item.nextAppointment)}}
                  onVisibleChange={() => console.log('visible change')}
                >
                  <Button type="primary" danger>Delete</Button>
                </Popconfirm>
              </div>
            </List.Item>
          )}
        />
      </div>

    </Row>
  );
};

export default PatientDetails;
