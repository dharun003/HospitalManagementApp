import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNewPatient from "./components/addNewPatient.jsx";
import LandingPage from "./components/landingPage";
import PatientDetails from "./components/patientDetails.jsx";
import PatientsList from "./components/patientsList.jsx";
import Login from "./components/signin.jsx";
import { auth } from "./utils/firebase.js";

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
        <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/addNewPatient" element={<AddNewPatient />} />
        <Route exact path="/patientsList" element={<PatientsList />} />
        <Route exact path="/patientDetails" element={<PatientDetails />} />
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

