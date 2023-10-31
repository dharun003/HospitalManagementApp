// EditMedicine.js

import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { auth } from "../utils/firebase";
import { useUserEmail } from "./UserContext";

const EditMedicine = ({ visible, onCancel, onEdit, currentMedicine }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userName = useUserEmail().userEmail;

  const updateMedicine = async (id, updatedData) => {
    try {
      // Get the reference to the medicine document with the provided ID
      const medicineRef = doc(db, "medicines_" + userName, id);

      // Update the medicine document with the updatedData object
      await updateDoc(medicineRef, updatedData);
      console.log("Medicine updated successfully!");
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error; // Propagate the error to the calling function if needed
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Perform the update operation to update the medicine entry
      // Replace "updateMedicine" with the appropriate function to update the medicine in the Firebase database
      await updateMedicine(currentMedicine.id, values);
      onEdit(); // Callback to refresh the medicines list after editing
      setLoading(false);
      onCancel(); // Close the modal after successful editing
    } catch (error) {
      console.error("Error editing medicine:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Edit Medicine"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="edit" type="primary" loading={loading} onClick={handleEdit}>
          Edit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={currentMedicine}>
        <Form.Item name="Name" label="Name" rules={[{ required: true, message: "Please enter the medicine name" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="Quantity" rules={[{ required: true, message: "Please enter the quantity" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Price" label="Price" rules={[{ required: true, message: "Please enter the price" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMedicine;
