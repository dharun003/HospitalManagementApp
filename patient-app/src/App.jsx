import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddMedicineForm from "./components/AddMedicineForm.jsx";
import AddNewPatient from "./components/addNewPatient";
import LandingPage from "./components/landingPage";
import MedicinesPage from "./components/MedicinesPage";
import PatientDetails from "./components/patientDetails.jsx";
import Login from "./components/signin.jsx";
import RevenuePage from "./components/RevenuePage.jsx";
import { auth } from "./utils/firebase.js";
import BillPage from "./components/BillPage";
import Header from "./components/header";
import { useUserEmail } from './components/UserContext'; 

const App =() => {
  const [isUserPresent, setIsUserPresent] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { setUserEmail } = useUserEmail();
  
  auth.onAuthStateChanged((user)=>{
    if(user){
      setIsUserPresent(true);
      console.log('User is signed in:', user);
      const userEmail = user.email;
	  
			//Set the user's email in the context
			setUserEmail(userEmail);
      console.log('UserEmail', userEmail);

    }
    else{
      setIsUserPresent(false);
      console.log('User is signed out');
    }

    setIsLoading(false);
  })

  if (isLoading) {
    // Display a loading indicator while authentication is in progress
    return <div>Loading...</div>;
  }


  if(isUserPresent === true){
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
        <Route exact path="/revenue" element={<RevenuePage />} />
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

