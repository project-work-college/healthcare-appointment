import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import HomeFooter from './HomeFooter';
import './adddepartment.css';
import { useAuth } from './AuthContext'
import SignIn from './SignIn';
import DoctorBody from './DoctorBody';


function AddDepartment() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const { isAuthenticated,userData } = useAuth(); // Add this inside the component
  const hospitalId = userData?.hospitalId; // Get hospital ID
  //console.log("user data is",userData);


  useEffect(() => {
    if (hospitalId) {
      fetchDepartments(hospitalId);
    }
  }, [hospitalId]); // Fetch departments when hospitalId is available

  const fetchDepartments = async (id) => {
    axios
      .get(`http://localhost:5000/hospital/departments/${id}`)
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => console.error('Error fetching departments:', error));
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!departmentName) return;
    console.log(departmentName);
    const hospitalId = userData?.hospitalId; // Ensure userData exists before accessing hospitalId
    console.log("Hospital ID:", hospitalId);

    axios
      .post('http://localhost:5000/hospital/add-department', { name: departmentName, hospital:hospitalId })
      .then((response) => {
        console.log('Department added:', response.data);
        setDepartments([...departments, response.data]);
        setDepartmentName('');
      })
      .catch((error) => console.error('Error adding department:', error));
  };

  return (
    <div>
       {isAuthenticated ? (
        <div>
      <DoctorHeader />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/DoctorBody')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div>
      <h1 id="heading" style={{marginTop:"70px"}}>Manage Departments</h1>
      {/* <button id="back-button" onClick={() => navigate('/DoctorBody')}>
        <i className="fa-solid fa-circle-left"></i>
      </button> */}
      <div id="main-container">
        <div id="addDep-box">
          <h2>Add New Department</h2>
          <form onSubmit={handleAddDepartment}>
            <input id="add"
              type="text"
              placeholder="Enter Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
            <button type="submit" id="add-but" onClick={handleAddDepartment} >Add Department</button>
          </form>
        </div>
        <div id="list-box">
          <h2>Existing Departments</h2>
          <ul id="dep-ul">
            {departments.map((dept) => (
              <li id="dep-li" key={dept._id}>{dept.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{height:"5px"}}></div>
      <HomeFooter />
    </div>) : (

        <div><SignIn /></div>
      )}
      <Routes>
        <Route path='/DoctorBody' element={<DoctorBody/>}/>
      </Routes>

    </div>
  );
}

export default AddDepartment;
