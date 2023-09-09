import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMedicineForm from "./components/AddMedicineForm.jsx";
import AddNewPatient from "./components/addNewPatient";
import LandingPage from "./components/landingPage";
import MedicinesPage from "./components/MedicinesPage";
import PatientDetails from "./components/patientDetails.jsx";
import Login from "./components/signin.jsx";
import { auth } from "./utils/firebase.js";
import BillPage from "./components/BillPage";
import Header from "./components/header";

const App =() => {
  const [user, setUser] = useState(true);
  
  auth.onAuthStateChanged((user)=>{
    if(user){
      setUser(true);
    }
    else{
      setUser(false);
    }
  })

  if(user === true){
    return (
      <Router>
          <div>
          <Header />
        <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/addNewPatient" element={<AddNewPatient />} />
        <Route exact path="/MedicinesPage" element={<MedicinesPage />} />
        <Route exact path="/patientDetails" element={<PatientDetails />} />
        <Route exact path="/AddMedicineForm" element={<AddMedicineForm />} />
        <Route exact path="/bill" element={<BillPage />} />
        </Routes>
        </div>
      </Router>
    );
  }
  else{
    return(
      <Router>
          <div>
        <Routes>
        <Route exact path="/" element={<Login />} />
        </Routes>
        </div>
      </Router>
    );
  }
    
}

export default App;

