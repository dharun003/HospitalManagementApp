// AddMedicineForm.js

import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useUserEmail } from "./UserContext";




const AddMedicineForm = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Price, setPrice] = useState("");
  const userName = useUserEmail().userEmail;

  const handleAddMedicine = async () => {
    try {
      // Validate the form data (you may add further validation as needed)
      if (!Name || !Quantity || !Price) {
        message.error("Please fill in all the fields.");
        return;
      }

      // Convert the quantity and price to integers
      const quantityInt = parseInt(Quantity);
      const priceInt = parseInt(Price);
      

      // Add the new document to the "medicines" collection in Firebase
      await addDoc(collection(db, "medicines_" + userName), { Name, Quantity: quantityInt, Price: priceInt });
      console.log('Add medicine page log',userName);
      message.success("Medicine added successfully.");
      navigate("/MedicinesPage");
    } catch (error) {
      console.error("Error adding medicine:", error);
      message.error("Failed to add medicine.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Medicine</h2>
      <Input placeholder="Name" value={Name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Quantity" type="number" value={Quantity} onChange={(e) => setQuantity(e.target.value)} />
      <Input placeholder="Price" type="number" value={Price} onChange={(e) => setPrice(e.target.value)} />
      <Button type="primary" onClick={handleAddMedicine}>Add Medicine</Button>
    </div>
  );
};

export default AddMedicineForm;
