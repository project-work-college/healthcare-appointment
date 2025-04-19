import React from 'react'
import './doctorBody.css'
import DoctorHeader from './DoctorHeader'
import DoctorImage from './DoctorImage'
import HomeFooter from './HomeFooter'
import { useNavigate, Routes, Route } from 'react-router-dom'
import AddDepartment from './AddDepartment'
import ViewDepartments from './ViewDepartments'
import ViewAppointments from './ViewAppointments'
import { useAuth } from './AuthContext'
import SignIn from './SignIn'


function DoctorBody() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <DoctorHeader />
          <DoctorImage />
          <div id="body">
            <div id="speciality">Manage Departments & Appointments</div>
            <div id="test">
              <div id="para">Easily manage your hospital departments and appointments with just a few clicks.</div>
            </div>
            <div id="test">
              <button id="card" onClick={() => navigate('/AddDepartment')}>
                <h2 style={{ marginBottom: "17px" }}>Add Department</h2>
                <p id="notes">Click here to add a new department to your hospital.</p>
              </button>
              <button id="card" onClick={() => navigate('/ViewDepartments')}>
                <h2 style={{ marginBottom: "17px" }}>View Departments</h2>
                <p id="notes">Check and manage all the existing departments here.</p>
              </button>
              <button id="card" onClick={() => navigate('/ViewAppointments')}>
                <h2 style={{ marginBottom: "17px" }}>View Appointments</h2>
                <p id="notes">Review and manage all patient appointments.</p>
              </button>
            </div>
          </div>
          <HomeFooter />
        </div>
      ) : (
        <div><SignIn /></div>
      )}
      
      <Routes>
        <Route path='/AddDepartment' element={<AddDepartment />} />
        <Route path='/ViewDepartments' element={<ViewDepartments />} />
        <Route path='/ViewAppointments' element={<ViewAppointments />} />
      </Routes>
    </div>
  )
}

export default DoctorBody;

