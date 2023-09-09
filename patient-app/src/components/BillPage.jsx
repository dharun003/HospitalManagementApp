import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { where, collection, query, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from 'uuid';
import jsPDF from "jspdf";
import "jspdf-autotable";

const BillPage = () => {
  const location = useLocation();
  const selectedMedicines = location.state.selectedMedicines;
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineQuantity, setNewMedicineQuantity] = useState("");
  const [newMedicinePrice, setNewMedicinePrice] = useState("");

  const fetchMedicineDetails = async () => {
    try {
      console.log(selectedMedicines);
      const q = query(collection(db, "medicines"), where("Name", "in", selectedMedicines.map(med => med.name)));
      const querySnapshot = await getDocs(q);
      const medicineDetailsData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          Name: doc.get("Name"),
          Quantity: selectedMedicines.filter(medicine => medicine.name === doc.get("Name"))[0].quantity,
          Price: doc.get("Price"),
        }))
      setMedicineDetails(medicineDetailsData);
    } catch (error) {
      console.error("Error fetching medicine details:", error);
    }
  };

  useEffect(() => {
    fetchMedicineDetails();
  }, [selectedMedicines]);

  const handleEditQuantity = async (id, newQuantity) => {
    try {
      //const medicineRef = doc(db, "medicines", id);
      //await updateDoc(medicineRef, { Quantity: newQuantity });
      setMedicineDetails((prevDetails) =>
        prevDetails.map((medicine) =>
          medicine.id === id ? { ...medicine, Quantity: newQuantity } : medicine
        )
      );
    } catch (error) {
      console.error("Error updating medicine quantity:", error);
    }
  };

  const handleEditPrice = async (id, newPrice) => {
    try {
      //const medicineRef = doc(db, "medicines", id);
      //await updateDoc(medicineRef, { Price: newPrice });
      setMedicineDetails((prevDetails) =>
        prevDetails.map((medicine) =>
          medicine.id === id ? { ...medicine, Price: newPrice } : medicine
        )
      );
    } catch (error) {
      console.error("Error updating medicine price:", error);
    }
  };

  const handleAddMedicine = async () => {
    try {
      // Perform necessary validation before adding the new medicine
      if (newMedicineName && newMedicineQuantity && newMedicinePrice) {
        const newMedicineData = {
          id: uuidv4(),
          Name: newMedicineName,
          Quantity: parseInt(newMedicineQuantity),
          Price: parseFloat(newMedicinePrice),
        };

        // Add new medicine to Firebase Firestore
        // You may need to adjust the collection name according to your data structure
        //await addMedicineToFirestore(newMedicineData);

        // Update local state with the new medicine
        setMedicineDetails((prevDetails) => [...prevDetails, newMedicineData]);

        // Clear the form fields after adding
        setNewMedicineName("");
        setNewMedicineQuantity("");
        setNewMedicinePrice("");
      }
    } catch (error) {
      console.error("Error adding new medicine:", error);
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      // Delete medicine from Firebase Firestore
      // You may need to adjust the collection name according to your data structure
      //await deleteMedicineFromFirestore(id);

      // Update local state by removing the deleted medicine
      console.info(id)
      console.info(medicineDetails);
      setMedicineDetails((prevDetails) =>
        prevDetails.filter((medicine) => medicine.id !== id)
      );

    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const generateBill = () => {
    const pdf = new jsPDF();

    const billDate = "2023-08-04"; // Replace this with your desired date

    const logoImage = "./components/logo.jpeg";

    // Create the bill header
    pdf.setFontSize(18);
    pdf.text("Medicine Bill", 105, 15, null, null, "center");
    

    // Add Subham Clinic information on the right side
    pdf.setFontSize(12);
    pdf.text("Subham Clinic", 190, 15, { align: "right" });
    pdf.text("Address: #245, Moolapalayam, Erode", 190, 22, { align: "right" });
    pdf.text("Email: Subham@gmail.com", 190, 29, { align: "right" });
    pdf.text("Phone number: 9447893389", 190, 36, { align: "right" });

    pdf.setLineWidth(0.5);
    pdf.line(20, 17, 190, 17); // Horizontal line under the title

    // Add Subham Clinic logo on the left side
    //pdf.addImage(logoImage, "PNG", 20, 10, 60, 20);

    // Create the bill information section
    pdf.setFontSize(12);
    pdf.text("Customer Name: John Doe", 20, 30);
    pdf.text(`Bill Date: ${billDate}`, 20, 40);

    // Create the bill table
    const columns = ["Name", "Quantity", "Price (per unit)", "Total"];
    const data = medicineDetails.map((medicine) => {
      console.info(medicine);
      console.info(medicine.Price.type);
      const price = parseFloat(medicine.Price);
      const quantity = parseInt(medicine.Quantity);
      const formattedPrice = !isNaN(price) ? `Rs.${price.toFixed(2)}` : "N/A";
      const total = !isNaN(price) && !isNaN(quantity) ? price * quantity : "N/A";
      const formattedTotal = !isNaN(total) ? `Rs.${total.toFixed(2)}` : "N/A";
      return [medicine.Name, medicine.Quantity.toString(), formattedPrice, formattedTotal];
    });

    pdf.autoTable({
      head: [columns],
      body: data,
      startY: 50,
      theme: "grid"
    });

    // Calculate and add the total amount
    const totalAmount = medicineDetails.reduce((formattedTotal, medicine) => formattedTotal + parseInt(medicine.Quantity) * parseFloat(medicine.Price), 0);
    pdf.text(`Total Amount: Rs.${totalAmount.toFixed(2)}`, 150, pdf.autoTable.previous.finalY + 10);

    // Add the signature line
    pdf.text("Signature: _______________________", 150, pdf.autoTable.previous.finalY + 20);

    // Save the PDF
    pdf.save("medicine_bill.pdf");
  };




  return (
    <div>
      <h2>Medicine Bill</h2>
      <hr />
      <div>
        <h4>Add New Medicine</h4>
        <TextField
          label="Name"
          value={newMedicineName}
          onChange={(e) => setNewMedicineName(e.target.value)}
        />
        <TextField
          label="Quantity"
          type="number"
          value={newMedicineQuantity}
          onChange={(e) => setNewMedicineQuantity(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          value={newMedicinePrice}
          onChange={(e) => setNewMedicinePrice(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddMedicine}>
          Add
        </Button>
        <Button variant="contained" color="success" onClick={generateBill}>
        Generate Bill
      </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="medicine table">
          <TableHead>
            <hr style={{
              position: 'absolute',
              top: '21%', /* Adjust this value to position the line vertically */
              left: 0,
              right: 0,

            }} />
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicineDetails.map((medicine) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.Name}</TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={medicine.Quantity}
                    onChange={(e) =>
                      handleEditQuantity(medicine.id, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    type="number"
                    value={medicine.Price}
                    onChange={(e) =>
                      handleEditPrice(medicine.id, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteMedicine(medicine.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BillPage;
