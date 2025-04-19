import React from 'react'
import DoctorHeader from './DoctorHeader'
import DoctorImage from './DoctorImage'
import HomeFooter from './HomeFooter'
import { Navigate,useNavigate,Route, Routes } from 'react-router-dom'
import EditProfile from './EditProfile'
import ViewDrAppntmnt from './ViewDrAppntmnt'
import SignIn from './SignIn'
import { useAuth } from './AuthContext';

function DrBody() {
  const navigate=useNavigate();
   const { isAuthenticated } = useAuth(); // Add this inside the component
   if (!isAuthenticated) {
    return <Navigate to="/SignIn" replace />; // ✅ Redirects unauthenticated users
  }
  return (
    <div>
      {isAuthenticated ? (
        <div>
      <DoctorHeader/>
      <DoctorImage/>
      <div id="body">
        <div id="speciality">Doctor Dashboard</div>
        <div id="test">
            <div id="para">Easily view your scheduled appointments and update your profile effortlessly for a seamless experience</div>
        </div>
        <div id="test">
        <button id="card" onClick={()=>navigate('/EditProfile')}>
            <h2 style={{marginBottom:"17px"}}>Edit Profile</h2>
            <p id="notes">Need to update your profile? Click here!</p>
        </button>
        <button id="card" onClick={()=>navigate('/ViewDrAppntmnt')}>
            <h2 style={{marginBottom:"17px"}}>View Appointments</h2>
            <p id="notes">Check on the schedule of the day!</p>
        </button>
        </div>
        </div>
      <HomeFooter/>
      </div>):(<div><SignIn /></div> )}
      <Routes>
        <Route path='/EditProfile' element={<EditProfile/>}/>
        <Route path='/ViewDrAppntmnt' element={<ViewDrAppntmnt/>}/>
      </Routes>
    </div>
  )
}

export default DrBody
