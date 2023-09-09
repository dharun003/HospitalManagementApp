// PrescriptionPDF.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  medicineRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  medicineName: {
    flexGrow: 1,
  },
  medicineQuantity: {
    flexGrow: 1,
    textAlign: "center",
  },
  medicinePrice: {
    flexGrow: 1,
    textAlign: "right",
  },
});

export const PrescriptionPDF = ({ medicines }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Prescription Preview</Text>
      {medicines.map((medicine, index) => (
        <View style={styles.medicineRow} key={index}>
          <Text style={styles.medicineName}>{medicine.name}</Text>
          <Text style={styles.medicineQuantity}>{medicine.quantity}</Text>
          <Text style={styles.medicinePrice}>Price: ${medicine.price}</Text>
        </View>
      ))}
    </Page>
  </Document>
);
