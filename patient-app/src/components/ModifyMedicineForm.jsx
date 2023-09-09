// ModifyMedicineForm.js

import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const ModifyMedicineForm = ({ medicineId }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    // Fetch the existing medicine data based on the provided medicineId
    const getMedicineData = async () => {
      try {
        const docRef = doc(db, "medicines", medicineId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setQuantity(data.quantity.toString());
          setPrice(data.price.toString());
        } else {
          message.error("Medicine not found.");
        }
      } catch (error) {
        console.error("Error fetching medicine data:", error);
        message.error("Failed to fetch medicine data.");
      }
    };

    getMedicineData();
  }, [medicineId]);

  const handleUpdateMedicine = async () => {
    try {
      // Validate the form data (you may add further validation as needed)
      if (!name || !quantity || !price) {
        message.error("Please fill in all the fields.");
        return;
      }

      // Convert the quantity and price to integers
      const quantityInt = parseInt(quantity);
      const priceInt = parseInt(price);

      // Update the existing medicine document in the "medicines" collection in Firebase
      await updateDoc(doc(db, "medicines", medicineId), { name, quantity: quantityInt, price: priceInt });

      message.success("Medicine updated successfully.");
      // You may navigate back to the LandingPage or take any other action after successful update.
    } catch (error) {
      console.error("Error updating medicine:", error);
      message.error("Failed to update medicine.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modify Medicine</h2>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <Input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <Button type="primary" onClick={handleUpdateMedicine}>Update Medicine</Button>
    </div>
  );
};

export default ModifyMedicineForm;
