import React from 'react'
import '../App.css'
import { Routes,Route,useNavigate } from 'react-router-dom'
import MainDocLog from '../MainDocLog';
import MainUser from './MainUser';


function Body() {
    const navigate=useNavigate();
  return (
    <div>
      <div>
            <div id="boxes">
            <button className="pic1" id="pic1" 
              onClick={()=>navigate('/MainDocLog')}
              style={{
              float: "left",
              width: "200px",
              height: "200px",
              backgroundColor: "white",}}>
            </button>
            <div style={{height:"150px",width:"150px"}}></div>
            <button className="pic2" id="pic1" 
            onClick={()=>navigate('/MainUser')}
            style={{
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
            <Routes>
                <Route path='/MainDocLog' element={<MainDocLog/>}/>
                <Route path='MainUser' element={<MainUser/>}/>
            </Routes>
    </div>
  )
}

export default Body
