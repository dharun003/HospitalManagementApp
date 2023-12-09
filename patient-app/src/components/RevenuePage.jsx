import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "antd";
import { Modal, Form, Input, Button, message, InputNumber } from "antd";
//import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useUserEmail } from "./UserContext";
import AddRevenueEntry from "./AddRevenueEntry";
import ScrollableChart from "./ScrollableChart";
import EditRevenue from "./EditRevenue";
import { Link } from "react-router-dom";

const RevenuePage = () => {
    const [form] = Form.useForm();
    const userName = useUserEmail().userEmail;
    const [revenueEntries, setRevenueEntries] = useState([]);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedEntry, setEditedEntry] = useState({});

    // Fetch all revenue entries
    useEffect(() => {
        fetchAllRevenueEntries();
    }, []);

    async function fetchAllRevenueEntries() {
        const entriesList = await getAllRevenueEntries();
        setRevenueEntries(entriesList);
    }

    // Function to get all revenue entries from Firebase
    async function getAllRevenueEntries() {
        const querySnapshot = await getDocs(collection(db, "revenue_" + userName));
        const entriesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            date: doc.get("date"),
            time: doc.get("time"),
            note: doc.get("note"),
            transaction: doc.get("transaction") || 'Credit',
            value: doc.get("value"),
        }));
        return entriesList;
    }

    const handleModalToggle = () => {
        setIsModalVisible(!isModalVisible);
    };



    // Function to delete a revenue entry
    const deleteRevenueEntry = async (entryId) => {
        try {
            await deleteDoc(doc(db, "revenue_" + userName, entryId));
            // Refresh entries after deleting entry
            const updatedEntries = await getAllRevenueEntries();
            setRevenueEntries(updatedEntries);
            message.success("Entry deleted successfully.");
        } catch (error) {
            console.error("Error deleting entry:", error);
            message.error("Failed to delete entry.");
        }
    };


    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
        },
        {
            title: "Transaction",
            dataIndex: "transaction",
            key: "transaction",
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => showModal(record)}>Edit</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    const showModal = (record) => {
        setEditedEntry(record);
        setIsEditModalVisible(true);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setEditedEntry({});
    };




    const handleDelete = (entryId) => {
        // Handle delete action
        deleteRevenueEntry(entryId);
    };

    const getDateObject = (dateString, timeString) => {
        const [day, month, year] = dateString.split("-");
        const [hour, min] = timeString.split(".");
        const date = new Date(`${year}-${month}-${day}T${hour}:${min}:00`);
        return date;
    };
    // Function to sort revenue entries by date and time
    const sortRevenueEntries = (entries) => {
        return entries.sort((a, b) => {
            const dateA = getDateObject(a.date, a.time);
            const dateB = getDateObject(b.date, a.time);
           
            console.log(dateA);
            console.log(dateB);

            return dateB - dateA;
        });
    };


    return (
        <Row>
            {/* Left half of the page - Dashboard with Bar Graph */}
            <Col span={12}>
                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> */}
                <div style={{ textAlign: 'center', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollableChart data={revenueEntries} filter="daily" /> {/* Pass revenueEntries data to the ScrollableChart */}
                </div>
            </Col>

            {/* Right half of the page - Display Revenue Table */}
            <Col span={12}>
                <Button onClick={handleModalToggle} style={{ marginBottom: "16px" }} type="primary">
                    Add Revenue Entry
                </Button>
                <Link to="/">
                    <Button>Back</Button>
                </Link>
                {/* Revenue Table */}
                <Table
                    dataSource={sortRevenueEntries(revenueEntries)}
                    columns={columns}
                    rowKey={(record) => record.id} // Use a unique identifier for each row
                />
            </Col>

            {editedEntry && (
                <EditRevenue
                    visible={isEditModalVisible}
                    onCancel={handleCancel}
                    onEdit={fetchAllRevenueEntries} 
                    editedEntry={editedEntry}
                />
            )}


            {/* Add Revenue Entry Modal */}
            <AddRevenueEntry
                visible={isModalVisible}
                setVisible={setIsModalVisible}
                updateEntries={fetchAllRevenueEntries}
            />

        </Row>
    );
};

export default RevenuePage;
