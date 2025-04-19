import React, { useEffect, useState } from 'react'
import DoctorHeader from './DoctorHeader'
import HomeFooter from './HomeFooter'
import './viewDrAppntmnt.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import SignIn from './SignIn';

function ViewDrAppntmnt() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated,userData } = useAuth(); // Add this inside the component
  const docId = userData?.doctorId; // Get doctor ID
  console.log(userData);
  useEffect(() => {
    if (!docId) {
      console.error("Doctor ID is missing! Check authentication.");
      return;
    }
    console.log("here id is ",docId);
    fetchAppointments(docId);
  }, [docId]); // Fetch departments when doctorId is available

const fetchAppointments = async(id) => {
  console.log("id is ",id);
  axios
    .get(`http://localhost:5000/hospital/doctor-appointment-history/${id}`)
    .then((response) => {
      console.log("response is ",response.data);
      setAppointments(response.data);
    })
    .catch((error) => console.error('Error fetching appointments:', error));
};
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
        <DoctorHeader/>
        {/* <h1>View</h1> */}
        <div style={{height:"62px"}}></div>
        <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/DrBody')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div>
      <div id="main-container">
        <div id="container-existing">
          <h2>Appointments List</h2>
          <ul id="appoint-ul">
          <div id="another-container" style={{marginBottom:"20px"}}>
              <div id="column-doc"style={{backgroundColor:"white"}}>
                <p id="styling-para"><strong>Patient</strong></p>
              </div>
              <div id="column-fees"style={{backgroundColor:"white"}}>
                <p id="styling-para"><strong>Age</strong></p>
              </div>
              <div id="column-date" style={{backgroundColor:"white"}}>
                <p id="styling-para"><strong>Date</strong></p>
              </div>
              <div id="column-slot" style={{backgroundColor:"white"}}>
                <p id="styling-para"><strong>Slot</strong></p>
              </div>
              <div id="column-sym"style={{backgroundColor:"white"}}>
                <p id="styling-para"><strong>Symptoms</strong></p>
              </div>
            </div>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div id="another-container" style={{marginBottom:"10px"}} key={appointment._id}>
                <div id="column-doc" style={{backgroundColor:"white"}}>
                  <p id="styling-para"> {appointment.patientName}</p>
                </div>
                <div id="column-fees" style={{backgroundColor:"white"}}>
                  <p id="styling-para"> {appointment.age}</p>
                </div>
                <div id="column-date" style={{backgroundColor:"white"}}>
                  <p id="styling-para"> {appointment.appointmentDate}</p>
                </div> 
                <div id="column-slot" style={{backgroundColor:"white"}}>
                  <p id="styling-para"> {appointment.appointmentTime}</p>
                </div> 
                <div id="column-sym" style={{backgroundColor:"white"}}>
                  <p id="styling-para"> {appointment.symptom}</p>
                </div>
                  </div>
              ))
            ) : (
              <p style={{textAlign:"center"}}>No appointments available</p>
            )}
          </ul>
        </div>
      </div>
      <div style={{height:"62px"}}></div>
        <HomeFooter/>
    </div>):(<div><SignIn /></div> )
}
    </div>
  )
}

export default ViewDrAppntmnt
