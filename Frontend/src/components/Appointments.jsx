import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import "./appointments.css";
import { useAuth } from "./AuthContext";
import SignIn from "./SignIn"; 
import axios from "axios";
import DoctorList from "./DoctorList";
import SymptomList from "./SymptomList";

function Appointments() {
  const { isAuthenticated, setIsAuthenticated, userData, setUserData } = useAuth();
  const navigate=useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;
  console.log("Doctor details:", doctor,"UserData:",userData);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [filteredSlots, setfilteredSlots] = useState([]);
  const [isAvailable, setisAvailable] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState({}); // Store slot availability

  
  const checkSlotAvailability = async (date, time) => {
    try {
      console.log("Checking slot availability for", date,"and the time is", time);
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("Invalid date received:", date);
        return false;
      }

      const utcTime = new Date(date?.getTime());
  //console.log(isNaN(selectedDateTime.getTime())); // Output: false (if valid)
  if (!time || !time.start) {
    console.error("selectedTime is undefined or missing 'start' property:", selectedTime);
    alert("Please select a valid time slot.");
    return;
}

      
    const timeMatch = time.start.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
    if (!timeMatch) {
      console.error("Invalid time format:", time.start);
      return false;
    }
    let [_, hours, minutes, period] = timeMatch;
    hours = Number(hours);
    minutes = Number(minutes);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    console.log("Final selectedDateTime:", utcTime.toISOString());
  //const [hours, minutes] = selectedTime.start.split(":").map(Number); // Extract hours and minutes
  utcTime.setHours(hours, minutes, 0, 0); // Set hours and minutes

    
      const response = await axios.get("http://localhost:5000/doctor/checkslots", {
        params: {
          appointmentDateTime: utcTime.toISOString(),
          doctorId: doctor.id,
        },
      });
      console.log("Selected DateTime:", utcTime.toISOString());
  
      return response.data.isSlotAvailable; // Returns true or false
    } catch (error) {
      console.error("Error checking slot:", error);
      return false;
    }
  };
 

  // Generate weekdays (Monday to Friday)
  const generateWeek = (startDate) => {
    const week = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate); //new date object ,ie,it makes a copy of startDate
      date.setDate(startDate.getDate() + i); //if startDate is March 3rd, 2025, getDate() returns 3 then increment
      week.push(date);
    }
    return week;
  };

  const checkAvailability = (date) => {
    const day = date.toLocaleDateString("en-US", { weekday: "long" }); // Extracts "Monday", "Tuesday", etc.
    return doctor.availability.includes(day); // Returns true if available
  };

  // Handle date selection
  const handleDateClick = async(date) => {
    setSelectedDate(date); //set the date in the button 
   // setSelectedDate(new Date(date.getTime()));
   

    const available = checkAvailability(date); //vailability of dr
    setisAvailable(available);
    if (available) {
      setfilteredSlots(doctor.timeSlots); // Show time slots if available
      // Fetch availability for each slot
      const availabilityMap = {};
      for (const slot of doctor.timeSlots) {
        const isAvailable = await checkSlotAvailability(date, slot);
        console.log(`Slot ${slot._id} availability:`, isAvailable);
        availabilityMap[slot._id] = isAvailable;
      }
      setSlotAvailability(availabilityMap);
    }
    console.log("Selected Date:", date.toDateString(),"type is :",typeof(date));
    console.log("Doctor available on this day?", available);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time); //selected time from button
    console.log(time.start)
  };

  const handleConfirm=async ()=>{
    console.log("Slot Availability State:", slotAvailability);
    console.log("Appointment confirmed for", selectedDate);
    
    //alert("Your appointment has been confirmed!!");
    // Convert selectedDate to a full DateTime object
 // const selectedDateTime = new Date(selectedDate);
  const selectedDateTime = new Date(selectedDate?.getTime());
  console.log(isNaN(selectedDateTime.getTime())); // Output: false (if valid)
  if (!selectedTime || !selectedTime.start) {
    console.error("selectedTime is undefined or missing 'start' property:", selectedTime);
    alert("Please select a valid time slot.");
    return;
}

console.log(selectedTime.start);
const timeMatch = selectedTime.start.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/); // Extract hours, minutes, and AM/PM
let [_, hours, minutes, period] = timeMatch;
hours = Number(hours);
minutes = Number(minutes);
if (period === "PM" && hours !== 12) {
  hours += 12;
} else if (period === "AM" && hours === 12) {
  hours = 0;
}
console.log("Final selectedDateTime:", selectedDateTime.toISOString());
  //const [hours, minutes] = selectedTime.start.split(":").map(Number); // Extract hours and minutes
  selectedDateTime.setHours(hours, minutes, 0, 0); // Set hours and minutes
  console.log(selectedDateTime instanceof Date);  // Output: true
  
  console.log(typeof(selectedDateTime));
  console.log("Doctor:", doctor.name ,"doctor id is ", doctor.id) ;
  console.log("user details :",userData);


  const requestBody = {
    patientId: userData?._id, // Ensure userData contains patient ID
    doctor: doctor?.id, // Ensure doctor ID exists
    hospital: doctor?.hospital, // Ensure hospital ID exists
    appointmentDateTime: selectedDateTime.toISOString(), // Send in ISO format
  };
 // appointment data to send and store in backend
 const confirmBooking = window.confirm("Are you sure you want to book this appointment?");
  if (!confirmBooking) {
    console.log("Booking status ",confirmBooking);
    return;
  }

  try {
    console.log("Booking appointment with data:", requestBody);
    const response = await axios.post("http://localhost:5000/doctor/bookappointment", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Appointment booked successfully:", response.data);
    // Save appointmentId for confirmation
    const appointmentId = response.data.appointmentId;
    localStorage.setItem("appointmentId", appointmentId);

    
    alert("Slot booked successfully! Proceed to confirmation.");
    // alert("Your appointment has been confirmed!");
    // alert("Your appointment has been confirmed!");
    navigate("/SymptomList");
    

  } catch (error) {
    console.error("Error booking appointment:", error.response?.data || error.message);
    alert("Failed to book appointment. Please try again.");
  }
};
    
  

  const weekDates = generateWeek(today);

  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    {isAuthenticated ?
    <div>
      <HomeHeader />
      <h2 id="bookAppmt">Book an Appointment</h2>
      <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/DoctorList')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div>
      
      <div id="container">
        {doctor  && ( //if doc not null/undefined/false
          <div id="doc">
            <h2 style={{marginBottom:"10px"}}>{doctor.name}</h2>
            <p><strong>Specialty:</strong> {doctor.specialization}</p>
            <p><strong>Qualification:</strong> {doctor.qualification}</p>
            <p><strong>Location:</strong> {doctor.location}</p>
            <p><strong>Hospital:</strong> {doctor.hospital}</p>
            <p><strong>Fee:</strong> {doctor.fee}</p>
            <p><strong>Available Days:</strong> {doctor.availability.join(", ")}</p>
           {/* <p><strong>Available :</strong>{doctor.Slots.join(", ")}</p>*/}
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div id="dateSelect">
        {weekDates.map((date) => ( //loops over each date in weekDates
          <button
            key={date.toDateString()} //React requires a unique key when rendering lists.
            onClick={() => handleDateClick(date)}
            style={{
              padding: "10px 15px",
              border: "1px solid #165e98",
              backgroundColor: selectedDate?.toDateString() === date.toDateString() ? "#165e98" : "white",//If selectedDate matches the date of this button Background = Blue (#165e98)
              // Text color = White
              color: selectedDate?.toDateString() === date.toDateString() ? "white" : "#165e98",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })} 
            {/* Tue, Mar 4 */}
          </button>
        ))}
      </div>

      {/* Selected Date and Time Slots */}
      {selectedDate && (  //Checks if selectedDate is not null or undefined
        <div id="selectedDate">
          <h3>Selected Date: {selectedDate.toDateString()}</h3>
          {isAvailable ? (
            <div id="timeselect">
              {filteredSlots.map((slot) => ( //Loops through filteredSlots, which contains the available time slots for the selected date
                <button key={slot._id} onClick={() => handleTimeClick(slot)} className="timeslot" 
                disabled={!slotAvailability[slot._id]} // Disable button if slot is unavailable
                  style={{padding: "10px 15px",
                  border: "1px solid #165e98",
                  backgroundColor: slotAvailability[slot._id]===false? "#D6D6D6" : (selectedTime?._id === slot._id ? "#165e98" : "white"), // Gray when disabled
      color: !slotAvailability[slot._id] ? "#A0A0A0" : (selectedTime?._id === slot._id ? "white" : "#165e98"), // Muted text when disabled
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",}}>
                  {slot.start}
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>Doctor not available on this day.</p>
          )}
        </div>
      )}
        <div id="confirmBut">
          {selectedDate && selectedTime && (
            
            <div>
              <button id="confirm" onClick={()=>handleConfirm()}>Confirm</button>
            </div>)}
      </div>
      <HomeFooter />
    </div>:<div><SignIn/></div>}
    <Routes>
        <Route path='/SignIn' element={<SignIn/>}/>
        <Route path='/DoctorList' element={<DoctorList/>}/>
        <Route path='/SymptomList' element={<SymptomList/>}/>
    </Routes>
    </div>
  );
}

export default Appointments;
