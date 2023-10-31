import * as React from "react";
//import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import {
  Modal,
  Button,
  Card,
  Input,
  Row,
  message,
  Popconfirm,
  Select,
} from "antd";
import { storage } from "../utils/firebase";
import {
  ref,
  deleteObject, // Import deleteObject
} from 'firebase/storage';
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
import ImageUpload from './ImageUpload';
import { v4 as uuidv4 } from 'uuid';
import { auth } from "../utils/firebase";
import { useUserEmail } from "./UserContext";

const { Option } = Select;

const PatientDetails = () => {
  const { TextArea } = Input;

  //To add visit
  const [visits, setVisits] = useState([]);
  const [problem, setProblem] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medicine, setMedicine] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [guidForVisit, setGuid] = useState("");
  const userName = useUserEmail().userEmail;

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
    const guid = uuidv4();
    setGuid(guid);
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    const documentRef = doc(db, "patients_" + userName, x.phoneNumber);

    // for(medicine in selectedMedicines)
    // {
    //   const medicineRef = doc(db, "medicines", medicine.id);
    //   updateDoc(medicineRef, { Quantity: medicine.actualQuantity - medicine.quantity});
    // }
    console.log(medicines);
    console.log(selectedMedicines);
    selectedMedicines.forEach(async (selectedMedicine) => {
      console.log(selectedMedicine.id)
      const medicineRef = doc(db, "medicines_" + userName, selectedMedicine.id);
    
      try {
        // Update the Firestore document
        await updateDoc(medicineRef, {
          Quantity: selectedMedicine.actualQuantity - selectedMedicine.quantity,
        });
    
        console.log(`Updated medicine: ${medicine.id}`);
      } catch (error) {
        console.error(`Error updating medicine: ${medicine.id}`, error);
      }
    });
    

    updateDoc(documentRef, {
      visits: arrayUnion({
        date: moment().format("DD-MM-YYYY"),
        problem: problem,
        treatment: treatment,
        images: uploadedImages,
        medicine: selectedMedicines.map((medicine) => ({
          name: medicine.name,
          quantity: medicine.quantity, // Change this to the property you want (actualQuantities or quantities)
        }))
      }),
    })
      .then(() => {
        setVisible(false);
        setConfirmLoading(false);
        loadMoreData();
      })
      .catch(() => { });
  };

  const VisitDelete = async (date, problem, treatment, images, medicine) => {
    let q = query(
      collection(db, "patients_" + userName),
      where("phoneNumber", "==", phoneNumber)
    );

    const querySnapshot = await getDocs(q);
    let patientDoc = null;
    querySnapshot.docs.map((doc) => {
      patientDoc = doc;
    });

    for (const image of images) {
      const storageRef = ref(storage, `Images/${image.guid}/${image.name}`);
      await deleteObject(storageRef).catch((error) => {
        console.error("Error deleting image folder:", error);
      });
    }

    const documentRef = doc(db, "patients_" + userName, patientDoc.id);
    console.log(patientDoc.id);

    updateDoc(documentRef, {
      visits: arrayRemove({
        date: date,
        problem: problem,
        images: images,
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


  const showBill = (selectedMedicines) => {
    navigate("/bill", { state: { selectedMedicines } });
  };

  const PatientDelete = async () => {
    await deleteDoc(doc(db, "patients_" + userName, x.phoneNumber));

    navigate("/", { replace: true });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const loadMoreData = () => {
    let q = query(
      collection(db, "patients_" + userName),
      where("phoneNumber", "==", x.phoneNumber)
    );

    getDocs(q)
      .then((querySnapshot) => {
        let patientDoc = null;
        querySnapshot.docs.map((doc) => {
          patientDoc = doc;
        });

        const docRef = doc(db, "patients_" + userName, patientDoc.id);

        getDoc(docRef)
          .then((doc) => {
            setName(doc.get("name"));
            setPhoneNumber(doc.get("phoneNumber"));
            setAddress(doc.get("address"));
            setVisits(doc.get("visits").reverse());
          })
          .catch(() => { });
      })
      .catch(() => { });
  };


  const buttonStyle = {
    backgroundColor: '#f2f2f2', // Button background color
    color: '#000', // Text color
    border: '1px solid #000', // Remove the default button border
    borderRadius: '4px', // Rounded corners
    padding: '4px 4px', // Padding for better readability
    fontSize: '10px', // Font size
    cursor: 'pointer', // Add a pointer cursor to indicate interactivity
    transition: 'background-color 0.3s ease'// Smooth color transition on hover
  };


  const fetchMedicines = async () => {

    const q = query(collection(db, "medicines_" + userName));
      const querySnapshot = await getDocs(q);
      const fetchedMedicines = querySnapshot.docs
        .map((doc) => ({
          Id: doc.id,
          Name: doc.get("Name"),
          Quantity: doc.get("Quantity")
        }))
    // const querySnapshot = await getDocs(collection(db, "medicines"));
    // //const fetchedMedicines = querySnapshot.docs.map((doc) => doc.data().Name);
    // const fetchedMedicines1 = querySnapshot.docs.map((doc) => {
    //   const data = doc.data();
    //   return {
    //     Id: doc.Id,
    //     Name: data.Name,
    //     Quantity: data.Quantity // Add the Quantity field
    //   };
    // });
    setMedicines(fetchedMedicines);
  };

  const addMedicine = (medicineName) => {

    const matchingMedicine = medicines.find((medicine) => medicine.Name === medicineName);
    const actualMedicineQuantity = matchingMedicine ? matchingMedicine.Quantity : 0;
    const medicineObj = { id: matchingMedicine.Id, name: medicineName, quantity: (actualMedicineQuantity - 1) >= 0 ? 1 : 0, actualQuantity: actualMedicineQuantity };
    setSelectedMedicines((prevSelected) => [...prevSelected, medicineObj]);

    console.log(medicine);
    console.log(uploadedImages);
    console.log(selectedMedicines);
  };

  const removeMedicine = (medicineName) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.filter((medicine) => medicine.name !== medicineName)
    );
  };

  // Function to increment the quantity of a medicine
  const incrementQuantity = (medicineName) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.map((medicine) =>
        medicine.name === medicineName
          ? { ...medicine, quantity: (medicine.actualQuantity - (medicine.quantity + 1)) >= 0 ? (medicine.quantity + 1) : medicine.quantity }
          : medicine
      )
    );
  };

  // Function to decrement the quantity of a medicine
  const decrementQuantity = (medicineName) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.map((medicine) =>
        medicine.name === medicineName && medicine.quantity > 1
          ? { ...medicine, quantity: medicine.quantity - 1 }
          : medicine
      )
    );
  };


  useEffect(() => {
    loadMoreData();
    fetchMedicines();
  }, []);


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
          <span>Images</span>

          <ImageUpload
            guid={guidForVisit}
            onImagesUpdated={(images) => setUploadedImages(images)} // Receive and set the images
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
          <Select
            style={{ width: "80%" }}

            onSelect={(value) => {

              //console.log(value);
              setMedicine(value);
              addMedicine(value);
            }}
            onDeselect={(value) => {

              //console.log(value);
              setMedicine(value);
              removeMedicine(value);
            }}
            // value={medicine.Name}
            mode="multiple"
            placeholder="Select medicine"
          >


            {medicines.map((medicine) => (
              <Option key={medicine.Name} value={medicine.Name}>
                {medicine.Name} (Existing Quantity:{" "}
                {medicine.Quantity || 0})
              </Option>
            ))}
          </Select>
        </Row>
        <Row align="start" direction="horizontal" justify="space-between">
          {selectedMedicines.length > 0 && (
            <div>
              <ul>
                {selectedMedicines.map((medicine) => (
                  <li key={medicine.name}>
                    <button
                      style={buttonStyle}
                      onClick={() => incrementQuantity(medicine.name)}>
                      +
                    </button>
                    <button
                      style={{ ...buttonStyle, marginRight: '8px' }}
                      onClick={() => decrementQuantity(medicine.name)}>
                      -
                    </button>
                    {medicine.name} (Quantity: {medicine.quantity}){" "}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
              
              
              <List.Item.Meta title={<h4>{item.date}</h4>}/>
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
                {item.images.length > 0 && (
                  <Row
                    align="start"
                    direction="horizontal"
                    justify="space-between"
                  >
                    <span>Images</span>
                    <List
                      dataSource={item.images}
                      renderItem={(img) => (
                        <List.Item style={{ display: 'inline-block', marginRight: '10px' }}>
                          <a href={img.url} target="_blank" rel="noopener noreferrer">
                            <img src={img.url} alt={img.name}
                              style={{ cursor: 'pointer', width: '50px', height: '50px' }} />
                          </a>
                        </List.Item>
                      )}
                    />
                  </Row>
                )}


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
                    defaultValue={item.medicine.map((medicine) => medicine.name)}
                  />
                </Row>

                <Popconfirm
                  title="Are you sure to delete this visit?"
                  onConfirm={() => {
                    VisitDelete(
                      item.date,
                      item.problem,
                      item.treatment,
                      item.images,
                      item.medicine
                    );
                  }}
                  onVisibleChange={() => console.log("visible change")}
                >
                  <Button type="primary" danger>
                    Delete
                  </Button>
                </Popconfirm>

                {/* <Button type="primary" onClick={() => showBill(item.medicine)}>
                  Show Bill
                </Button> */}
              </div>
            </List.Item>
          )}
        />
      </div>
    </Row>
  );
};

export default PatientDetails;
