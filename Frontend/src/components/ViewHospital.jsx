
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorHeader from './DoctorHeader';
import HomeFooter from './HomeFooter';
import './viewdepartment.css';
import { useAuth } from './AuthContext';
import SignIn from './SignIn';
import AdminBody from './AdminBody';

function ViewHospital() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const { isAuthenticated,userData } = useAuth(); // Add this inside the component
  const hospitalId = userData?.hospitalId; // Get hospital ID
  const [hoveredDoctor, setHoveredDoctor] = useState(null); 
   useEffect(() => {
        fetchHospitals();
    }, [hospitals]); // Fetch hospitals 



    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/hospital/");
        setHospitals(response.data); // Store hospitals in state
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

const handleAddHospital = () => {
    console.log("Add hospital clicked");
    // console.log(userData)
    navigate('/AddHospital')
    // Implement Add Doctor functionality
  };

  const handleIconClick = (hospital) => {
    console.log(`Deleting hospital ${hospital.name} with ID ${hospital._id}`);
     const confirmDelete = window.confirm(`Are you sure you want to delete ${hospital.name}?`);
     if (confirmDelete) {
       console.log(`Deleting Hospital ${hospital.name}`);
       axios
       .delete(`http://localhost:5000/feature/delete-hospital/${hospital._id}`)
       .then((response) => {
         console.log(`Doctor ${hospital.name} deleted successfully!`, response.data);
         // Remove the deleted hospital from the state
         setHospitals((prevHospitals) => prevHospitals.filter((h) => h._id !== hospital._id));
         alert("Hospital deleted successfully!");
       })
       .catch((error) => {
         console.error("Error deleting hospital:", error);
         alert("Failed to delete hospital. Please try again.");
       });
      
     } else {
       console.log("Deletion canceled");
     }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
      <DoctorHeader />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/AdminBody')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div>
      {/* <div style={{marginTop:"100px"}}></div> */}
      <div id="but-div">
        <button id="buttonStyle" style={{marginRight:"0",marginTop:"15px"}} onClick={handleAddHospital}>Add Hospital</button>
      </div>
      <div id="main-container">
        <div id="existing" style={{width:"40%"}}>
          <h2>Existing Hospitals</h2>
          <ul id="ul">
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => <li key={hospital._id} id="li" 
              onMouseEnter={() => setHoveredDoctor(hospital._id)}
                onMouseLeave={() => setHoveredDoctor(null)}style={{ position: "relative" }} 
              // onClick={()=>navigate('/DeptList', { state: { hospital } })}
              >{hospital.name} - {hospital.location}
              {hoveredDoctor===hospital._id && (<i className="fa-solid fa-trash" id="hover-icon" style={{top:"10px"}} onClick={()=>handleIconClick(hospital)}/>)}
              </li>)
            ) : (
              <p style={{textAlign:"center"}}>No Hospital available</p>
            )}
          </ul>
        </div>
      </div>
      <div style={{height:"62px"}}></div>
      <HomeFooter />
    </div>):(<div><SignIn /></div>)}
    <Routes>
      {/* <Route path='/DeptList' element={<DeptList/>}/> */}
      <Route path='/AdminBody' element={<AdminBody/>}/>
    </Routes>
    </div>
  );
}

export default ViewHospital;
