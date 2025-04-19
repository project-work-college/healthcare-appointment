import React, { useState } from 'react'
import '../inside.css'
import {Routes, Route, useNavigate } from 'react-router-dom'



function InsideUser() {
  const navigate=useNavigate();

  return (
    <div>
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <div>

        <div id="optionBoxes">
        <button className="searchHosp" id="searchHosp" 
          style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white",}}
          onClick={()=>{
            // console.log("Navigating....")
            navigate('/SearchHosp')
          }}>
        </button>
        <div style={{height:"90px",width:"90px"}}></div>
        <button className="searchLoc" id="searchHosp" 
        onClick={()=>{
          // console.log("Navigating....")
          navigate('/SearchLoc')
        }}
          style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white"}}>
        </button>
        <div style={{height:"90px",width:"90px"}}></div>
        <button className="searchDoc" id="searchHosp" 
        onClick={()=>{
          // console.log("Navigating....")
          navigate('/SearchDoc')
        }}
        style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white"}}>
        </button>
        
      </div>
      <div id="text">
        <p id="login" style={{
          float: "left",
          width: "200px",
          height: "30px"}}>Search for Hospital</p>
          <div style={{width:"50px"}}></div>
        <p id="login" style={{
          float: "left",
          width: "200px",
          height: "30px"}}>Search for Location</p>
          <div style={{width:"50px"}}></div>

        <p id="login"  style={{
          float: "left",
          width: "200px",
          height: "30px",}}>Search For Doctor</p>
          </div>
      
        <div id="optionBoxes">
        <button className="appointment" id="searchHosp" 
          style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white",}}>
        </button>
        <div style={{height:"90px",width:"90px"}}></div>
        <button className="calendar" id="searchHosp" style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white"}}>
        </button>
        <div style={{height:"90px",width:"90px"}}></div>
        <button className="lab" id="searchHosp" style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white"}}>
        </button>
      
      </div>
      <div id="text">
        <p id="login" style={{
          float: "left",
          width: "150px",
          height: "30px"}}>Appointments</p>
          <div style={{width:"80px"}}></div>
        <p id="login" style={{
          float: "left",
          width: "150px",
          height: "30px"}}>Calendar</p>
          <div style={{width:"80px"}}></div>

        <p id="login"  style={{
          float: "left",
          width: "150px",
          height: "30px",}}>Lab Checkups</p>
          </div>

        
        <div id="optionBoxes">
        <button className="firstAid" id="searchHosp" 
          style={{
          float: "left",
          width: "150px",
          height: "150px",
          backgroundColor: "white",}}>
        </button>
        </div>
        <div id="text">
        <p id="login" style={{
          float: "left",
          width: "150px",
          height: "30px"}}>First Aid</p></div>  
          
        </div>
        
   
        <Routes>
          <Route path='/SearchHosp' element={<SearchHosp/>}/>
          <Route path='/SearchLoc' element={<SearchLoc/>}/>
          <Route path='SearchDoc' element={<SearchDoc/>}/>
        </Routes> */}
   
    </div>
  )
}

export default InsideUser
