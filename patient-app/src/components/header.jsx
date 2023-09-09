import React from "react";
import logo from "./logo.jpeg";
import './header.css'

const Header = () => {
  return (
    <nav>

      <div  className='div-header'>

      <div className='div-svg'>
      <img src={logo} alt="Logo" style={{ width: "75px" , right: 0}} />
    </div>

      </div>
      


    </nav>
   // <div style={{ position: "fixed", top: 0, right: 0, padding: "10px", backgroundColor: "#f0f0f0" }}>
    
  );
};

export default Header;