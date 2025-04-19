import React from 'react'
import HomeHeader from './HomeHeader'
import HomeFooter from './HomeFooter'
import './appointmentHistory.css'
import { Route, Routes, useNavigate } from 'react-router-dom';
import DoctorList from './DoctorList';
import { useAuth } from "./AuthContext";
import SignIn from "./SignIn"; 
import {useEffect,useState } from "react";
import axios from "axios";

function AppointmentHistory() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(""); // Track error messages
    const [selectedAppointment,setSelectedAppointment]=useState(null);
    const [hoveredAppointment, setHoveredAppointment] = useState(null);

    const { isAuthenticated, setIsAuthenticated, userData, setUserData } = useAuth();
    const navigate=useNavigate();
    

   // console.log("User Data:", userData);
   useEffect(() => {
    const fetchAppointments =async () => {
      try {
        if (!userData?._id) {
          console.error("User ID is missing!");
          setError("User not logged in.");
          return;
        }
        const response = await axios.get(`http://localhost:5000/doctor/history/${userData._id}`);
      console.log("Appointment history of:", response.data.patientName);
      console.log("API response:", response.data);

      const updatedAppointments = response.data.appointments.map((appointment) => {
        const [day, month, year] = appointment.appointmentDate.split("-"); // Split DD-MM-YYYY
  const formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD format

  const appointmentDateTime = new Date(`${formattedDate} ${appointment.appointmentTime}`);

  const now = new Date(); 
        console.log(`Appointment: ${appointment.appointmentDate} ${appointment.appointmentTime}`);
  console.log(`Parsed Appointment DateTime: ${appointmentDateTime}`);
  console.log(`Current DateTime: ${now}`);


        let status = appointment.status; // Keep existing status
        // console.log(today)
        if (status !== "Cancelled") {
          if (appointmentDateTime < now) {
            status = "Completed"; // Past appointments are completed
          } else {
            status = "Confirmed"; // Future appointments are confirmed
          }
        }

        return { ...appointment, status };
      });

      setAppointments(updatedAppointments);
      setError(""); // Reset error state if successful
      
    }catch(error){
      console.error("Error fetching appointments:", error);
      if (err.response && err.response.status === 404) {
        setError("No appointments yet...."); // Set custom message
      }
    }
  };
    fetchAppointments()
},[userData]);
    useEffect(() => {
      if (appointments.length > 0) {
        console.log("Appointments:", appointments[0]); 
        console.log("Total Appointments:", appointments.length);
      }
    }, [appointments]); 
  

   // Debugging: Track selected appointment
   useEffect(() => {
    if (selectedAppointment) {
        console.log("Selected Appointment:", selectedAppointment);
    }
}, [selectedAppointment]);

// Handle click event for appointment selection
const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
};
    

     const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
       if (!confirmCancel) return;
  
       try {
         await axios.put(`http://localhost:5000/doctor/cancel-appointment/${appointmentId}`);
         setAppointments((prev) =>
           prev.map((appt) =>
             appt._id === appointmentId ? { ...appt, status: "Cancelled" } : appt
           )
         );
         alert("Appointment cancelled successfully.");
       } catch (error) {
         console.error("Error cancelling appointment:", error);
        alert("Failed to cancel the appointment. Please try again.");
      }
     };
    
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      {isAuthenticated ? (
    <div>
      <HomeHeader/>
      <div id="appointment-history">
            <h1>Appointment History</h1>
      </div>

      <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/HomeBody')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div>

      {appointments.length>0?
          (<div id="appointment-container">
            <div id="another-container">
              <div id="column-doc">
                <p id="styling-para"><strong>Doctor</strong></p>
              </div>
              <div id="column-hosp">
                <p id="styling-para"><strong>Hospital</strong></p>
              </div>
              <div id="column-fees">
                <p id="styling-para"><strong>Fees</strong></p>
              </div>
              <div id="column-date">
                <p id="styling-para"><strong>Date</strong></p>
              </div>
              <div id="column-slot">
                <p id="styling-para"><strong>Slot</strong></p>
              </div>
              <div id="column-date">
                  <p id="styling-para"><strong>Status</strong></p>
              </div>
            </div>
            {appointments
            .map((appointment, index) => (
              <div key={index} id="another-container"
                onMouseEnter={() => handleAppointmentClick(appointment._id)}
                onMouseLeave={() => handleAppointmentClick(null)} style={{ position: "relative" }} 
                >
                <div id="column-doc">
                  <p id="styling-para"> {appointment.doctorName}</p>
                </div>
                <div id="column-hosp" >
                <p id="styling-para"> {appointment.hospitalName},{appointment.location}</p>
                </div>
                <div id="column-fees" >
                <p id="styling-para"> {appointment.fee}</p>
                </div>
                <div id="column-date">
                  <p id="styling-para">{appointment.appointmentDate}</p>
                </div>
                <div id="column-slot">
                  <p id="styling-para"> {appointment.appointmentTime}</p>
                </div>
                <div id="column-date">
                    <p style={{
        backgroundColor: 
        appointment.status === "Completed" ? "green" : 
        appointment.status === "Confirmed" ? "blue" : 
        "red",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        textAlign: "center",
        fontWeight: "bold",
        display: "inline-block",
        minWidth: "100px",
        marginTop:"10px"
        }}>{appointment.status}</p>
                  </div>
                  {appointment.status === "Confirmed" && selectedAppointment === appointment._id && (
                    <i
                      className="fa-solid fa-xmark"
                      id="hover-icon"
                      style={{
                        cursor: "pointer",
                        top: "6px",left:"1100px",
                        display: selectedAppointment === appointment._id ? "inline" : "none",color:"red",fontSize:"xx-large"
                      }}
                      onMouseEnter={() => handleAppointmentClick(appointment._id)}
                      onMouseLeave={() => handleAppointmentClick(null)}
                      onClick={() => handleCancel(appointment._id)}
                    />
                  )}
              </div>
            ))}
          </div>):
          <div>
            <div id="no">No Appointments yet....</div>
            <div id="else-div">
              <button id="book-but" onClick={()=>navigate('/DoctorList')}>Explore Doctors</button>
            </div>
            <div style={{height:"63px"}}></div>
          </div>
        }
    <HomeFooter/>
    </div>
       ) : (
        <div>
          <SignIn/>
        </div>
      )} 
      <Routes>
        <Route path='/DoctorList' element={<DoctorList/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
      </Routes>
    </div>
  )
}

export default AppointmentHistory
