import React from 'react'
import '../App.css'
import Header from '../components/Header'
import SignIn from '../components/SignIn'
import {Routes,Route} from 'react-router-dom'
import SignUp from '../components/SignUp'

function MainUser() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/SignIn" element={<SignIn />} />
        <Route  element={<SignUp/>} path="/SignUp" />
      </Routes>
    </div>
  )
}

export default MainUser
