import "./App.css";
import React from "react";
import find_my_doc from "./assets/find_my_doc.png"
import doctor from "./doctor.jpg"
// import UserLogin from "./userLogin";

function App(){
  return (

    <>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      
    <div className="navbar">   
      <img id="findDoc" src={find_my_doc} alt=""  />
      <h1>Find My Dr</h1>
      <div id="boxes">
        <button className="pic1" id="pic1" 
          style={{
          float: "left",
          width: "200px",
          height: "200px",
          backgroundColor: "white",}}>
        </button>
        <div style={{height:"150px",width:"150px"}}></div>
        <button className="pic2" id="pic1" style={{
          float: "left",
          width: "200px",
          height: "200px",
          backgroundColor: "white"}}>
        </button>
      </div>
      <div id="text">
        <p id="login" style={{
          float: "left",
          width: "150px",
          height: "30px",}}>Login as Admin</p>
        <p id="login"  style={{
          float: "left",
          width: "150px",
          height: "30px",
          marginLeft:"200px",}}>Login as User</p>

      </div>
    </div>
    </>
  )
}

export default App