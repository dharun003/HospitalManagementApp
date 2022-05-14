import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Modal,
  Button,
  Card,
  Input,
  Row,
  message,
  Popconfirm,
} from "antd";
import { db } from "../utils/firebase";
import { useState, useEffect } from "react";
import { List } from "antd";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import moment from "moment";

const PatientDetails = () => {
  const { TextArea } = Input;

  //To add visit
  const [visits, setVisits] = useState([]);
  const [problem, setProblem] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medicine, setMedicine] = useState("");

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
    setConfirmLoading(true);

    const documentRef = doc(db, "patients", x.phoneNumber);

    updateDoc(documentRef, {
      visits: arrayUnion({
        date: moment().format("DD-MM-YYYY"),
        problem: problem,
        treatment: treatment,
        medicine: medicine,
      }),
    })
      .then(() => {
        setVisible(false);
        setConfirmLoading(false);
        loadMoreData();
      })
      .catch(() => {});
  };

  const VisitDelete = async (date, problem, treatment, medicine) => {
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
        medicine: medicine,
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

    navigate("/", { replace: true });
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

    getDocs(q)
      .then((querySnapshot) => {
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
      })
      .catch(() => {});
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
      <Card
        title={name}
        style={{ width: 300 }}
        extra={
          <Popconfirm
            title="Are you sure to delete this patient?"
            onConfirm={() => {
              PatientDelete();
            }}
            onVisibleChange={() => console.log("visible change")}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        }
      >
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
          <span>Medicine</span>
          <TextArea
            rows={4}
            style={{ width: "80%" }}
            onChange={(event) => setMedicine(event.target.value)}
            defaultValue=""
          />
        </Row>
      </Modal>

      {/* Visits List */}
      <div
        id="scrollableDiv"
        style={{
          alignItems: "start",
          justifyItems: "start",
          height: 500,
          width: 800,
          overflow: "auto",
          padding: "0 20px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <List
          dataSource={visits}
          itemLayout="horizontal"
          renderItem={(item) => (
            <List.Item style={{}} key={item.id}>
              <List.Item.Meta title={<h5>{item.date}</h5>} />
              <div
                style={{
                  width: 500,
                }}
              >
                <Row
                  align="start"
                  direction="horizontal"
                  justify="space-between"
                >
                  <span>Problem</span>
                  <TextArea
                    rows={2}
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      color: "black",
                    }}
                    disabled
                    defaultValue={item.problem}
                  />
                </Row>
                <Row
                  align="start"
                  direction="horizontal"
                  justify="space-between"
                >
                  <span>Treatment</span>
                  <TextArea
                    rows={2}
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      color: "black",
                    }}
                    disabled
                    defaultValue={item.treatment}
                  />
                </Row>
                <Row
                  align="start"
                  direction="horizontal"
                  justify="space-between"
                >
                  <span>Medicine</span>
                  <TextArea
                    rows={2}
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      color: "black",
                    }}
                    disabled
                    defaultValue={item.medicine}
                  />
                </Row>

                <Popconfirm
                  title="Are you sure to delete this visit?"
                  onConfirm={() => {
                    VisitDelete(
                      item.date,
                      item.problem,
                      item.treatment,
                      item.medicine
                    );
                  }}
                  onVisibleChange={() => console.log("visible change")}
                >
                  <Button type="primary" danger>
                    Delete
                  </Button>
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
