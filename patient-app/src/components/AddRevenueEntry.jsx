import React, { useState } from "react";
import { Modal, Form, Input, Button, message, InputNumber } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserEmail } from "./UserContext";
import moment from "moment";
import { Switch, Typography } from 'antd';


const AddRevenueEntry = ({ visible, setVisible, updateEntries }) => {
  const [form] = Form.useForm();
  const userName = useUserEmail().userEmail;


  const [switchValue, setSwitchValue] = useState(true);

  const handleSwitchChange = (checked) => {
    setSwitchValue(checked);
    form.setFieldsValue({ transaction: checked ? 'Credit' : 'Debit' });
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await addDoc(collection(db, "revenue_" + userName), values);
      message.success("Entry added successfully.");
      updateEntries(); // Update entries in parent component
      setVisible(false);
      setSwitchValue(true);
      form.resetFields();
    } catch (error) {
      console.error("Error adding entry:", error);
      message.error("Failed to add entry.");
    }
  };

  const currentTime = moment().format("HH.mm") // Format as HH:MM
  const currentDate = moment().format("DD-MM-YYYY")

  return (
    <Modal
      title="Add Revenue Entry"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAdd}>
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ transaction: 'Credit' }}>
        <Form.Item name="date" label="Date" initialValue={currentDate} rules={[{ required: true, message: "Please enter date" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="time" label="Time" initialValue={currentTime} rules={[{ required: true, message: "Please enter time" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Note" rules={[{ required: true, message: "Please enter note" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="transaction" label="Transaction">
          <Switch
            checked={switchValue}
            
            onChange={handleSwitchChange}
            checkedChildren="Credit"
            unCheckedChildren="Debit"
            style={{ backgroundColor: switchValue ? 'green' : 'red' }}
            
          />
        </Form.Item>
        <Form.Item name="value" label="Value" rules={[{ required: true, message: "Please enter value" },
        {
          type: "number",
          message: "Please enter a valid number",
        }]}>
          <InputNumber style={{ width: "100%" }} placeholder="Enter value" min={0} step={0.01} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRevenueEntry;
