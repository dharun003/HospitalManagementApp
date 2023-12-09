// EditRevenue.js

import React, { useState } from "react";
import { Modal, Form, Input, Button, message, InputNumber } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { auth } from "../utils/firebase";
import { useUserEmail } from "./UserContext";
import { Switch } from 'antd';

const EditRevenue = ({ visible, onCancel, onEdit, editedEntry }) => {
    const [form] = Form.useForm();
    console.log("Transaction type:", typeof editedEntry.transaction);
    console.log("Transaction value:", editedEntry.transaction);
    form.setFieldsValue(editedEntry);
    const [loading, setLoading] = useState(false);
    const userName = useUserEmail().userEmail;
    const transaction = form.getFieldValue('transaction')


    const [switchValue, setSwitchValue] = useState( form.getFieldValue('transaction') === 'Credit');

    const handleSwitchChange = (checked) => {
        
        form.setFieldsValue({ transaction });
    };



    const editRevenueEntry = async (id, updatedData) => {
        try {

            const revenueRef = doc(db, "revenue_" + userName, id);
            await updateDoc(revenueRef, updatedData);

            message.success("Entry updated successfully.");
        } catch (error) {
            console.error("Error updating entry:", error);
            message.error("Failed to update entry.");
        }
    };


    const handleEdit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await editRevenueEntry(editedEntry.id, values);
            onEdit();
            setLoading(false);
            onCancel();
        } catch (error) {
            console.error("Error editing revenue:", error);
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Revenue Entry"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="edit" type="primary" loading={loading} onClick={handleEdit}>
                    Update
                </Button>,
            ]}>


            <Form form={form} layout="vertical" >

                <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please enter date" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="time" label="Time" rules={[{ required: true, message: "Please enter time" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="note" label="Note" rules={[{ required: true, message: "Please enter note" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="transaction" label="Transaction">
                    <Switch
                        checked={form.getFieldValue('transaction') === 'Credit'}
                        onChange={handleSwitchChange}
                        checkedChildren="Credit"
                        unCheckedChildren="Debit"
                        style={{ backgroundColor: form.getFieldValue('transaction') === 'Credit'  ? 'green' : 'red' }}

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

export default EditRevenue;
