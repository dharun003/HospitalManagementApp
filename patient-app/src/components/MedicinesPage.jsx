// MedicinesPage.js

import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import EditMedicine from "./EditMedicine";
import { auth} from "../utils/firebase";
import { useUserEmail } from "./UserContext";

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const userName = useUserEmail().userEmail;

  const showEditModal = (medicine) => {
    setCurrentMedicine(medicine);
    setEditModalVisible(true);
  };

  const hideEditModal = () => {
    setEditModalVisible(false);
    setCurrentMedicine(null);
  };

  // Function to fetch the list of medicines from the Firebase database
  const fetchMedicines = async () => {
    const q = query(collection(db, "medicines_" + userName));
    console.log('Medicines page log',userName);
    const querySnapshot = await getDocs(q);
    const medicinesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      Name: doc.get("Name"),
      Quantity: doc.get("Quantity"),
      Price: doc.get("Price"),
    }));
    setMedicines(medicinesList);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Function to handle deleting a medicine entry
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "medicines_" + userName, id));
      fetchMedicines(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "actions",
      render: (id, record) => (
        <span>
          <Button type="primary" onClick={() => showEditModal(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => handleDelete(id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Link to="/AddMedicineForm">
        <Button>Add Medicine</Button>
      </Link>
      <Link to="/">
        <Button>Back</Button>
      </Link>
      <Table dataSource={medicines} columns={columns} />
      {currentMedicine && (
        <EditMedicine
          visible={editModalVisible}
          onCancel={hideEditModal}
          onEdit={fetchMedicines} // Callback to refresh the medicines list after editing
          currentMedicine={currentMedicine}
        />
      )}
    </div>
  );
};

export default MedicinesPage;
