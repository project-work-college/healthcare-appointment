import React from 'react'
import './Home.css'
import { useState } from 'react';

function Home() {
  const [active, setActive] = useState("");
  const clickEvent=(e)=>{
    setActive(e.target.href.split("#")[1]);
   
  };
  return (
    <div>
        <div className='header'>
        <h1>Find My Dr</h1>
        <nav className="navbar">
        <a href="#home" onClick={clickEvent} className={active === "home" ? "update" : ""}>HOME</a>
        <a href="#about" onClick={clickEvent} className={active === "about" ? "update" : ""}>ABOUT</a>
        <a href="#contact" onClick={clickEvent} className={active === "contact" ? "update" : ""}>CONTACT</a>
        <a href="#service" onClick={clickEvent} className={active === "service" ? "update" : ""}>SERVICE</a>
        </nav>
        
        <div className='login-signup'>
          <button className='login'>Login</button>
          <button className='signup'>Sign Up</button>

        </div>
        </div>
      
    </div>
  )
}

export default Home
