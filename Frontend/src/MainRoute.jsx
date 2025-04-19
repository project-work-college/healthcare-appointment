import React from 'react'
import Home from './Home'
import { Route,Routes } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Contact from './components/Contact'
import FirstAid from './components/FirstAid'
import About from './components/About'
import Service from './components/Service'
import HomeBody from './components/HomeBody'
import DoctorList from './components/DoctorList'
import Appointments from './components/Appointments'
import AppointmentHistory from './components/AppointmentHistory'
import SymptomList from './components/SymptomList'
import DoctorBody from './components/DoctorBody'
import AddDepartment from './components/AddDepartment';
import ViewDepartments from './components/ViewDepartments';
import ViewAppointments from './components/ViewAppointments';
import DrBody from './components/DrBody'
import EditProfile from './components/EditProfile'
import ViewDrAppntmnt from './components/ViewDrAppntmnt'
import DeptList from './components/DeptList'
import AddDr from './components/AddDr'
import AdminBody from './components/AdminBody'
import ViewHospital from './components/ViewHospital'
import AddHospital from './components/AddHospital'
import EditDr from './components/EditDr'
import Reset from './components/Reset'
import PasswordReset from './components/PasswordReset'


function MainRoute() {
  return (
    <div>
      <Routes>
        
        <Route path='*' element={<Home/>}/>
        <Route path="/SignIn/*" element={<SignIn/>}/>
        <Route path="/SignUp/*" element={<SignUp/>}/>
        <Route path="/Contact/*" element={<Contact/>}/>
        <Route path='/FirstAid/*' element={<FirstAid/>}/>
        <Route path='/About/*' element={<About/>}/>
        <Route path='/Service/*' element={<Service/>}/>
        <Route path='/HomeBody/*' element={<HomeBody/>}/>
        <Route path='/DoctorList/*' element={<DoctorList/>}/>
        <Route path='/Appointments/*' element={<Appointments/>}/>
        <Route path='/AppointmentHistory/*' element={<AppointmentHistory/>}/>
        <Route path='/SymptomList/*' element={<SymptomList/>}/>
        <Route path='/DoctorBody/*' element={<DoctorBody/>}/>
        <Route path="/AddDepartment" element={<AddDepartment />} />
        <Route path="/ViewDepartments/*" element={<ViewDepartments />} />
        <Route path="/ViewAppointments" element={<ViewAppointments />} />
        <Route path="/DrBody/*" element={<DrBody/>}/>
        <Route path="/EditProfile/*" element={<EditProfile/>}/>
        <Route path="/ViewDrAppntmnt/*" element={<ViewDrAppntmnt/>}/>
        <Route path="/DeptList/*" element={<DeptList/>}/>
        <Route path="/AddDr/*" element={<AddDr/>}/>
        <Route path="/AdminBody/*" element={<AdminBody/>}/>
        <Route path="/ViewHospital/*" element={<ViewHospital/>}/>
        <Route path='/AddHospital/*' element={<AddHospital/>}/>
        <Route path='/EditDr/*' element={<EditDr/>}/>
        <Route path="/Reset/*" element={<Reset/>}/>
        <Route path='/PasswordReset/*' element={<PasswordReset/>}/>
      </Routes>
    </div>
  )
}

export default MainRoute
