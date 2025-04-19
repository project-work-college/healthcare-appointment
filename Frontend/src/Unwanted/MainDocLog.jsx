import React from 'react'
import './App.css'
import Header from '../components/Header'
import DocLog from '../components/SignIn'
import DocSignUp from './DocSignUp'
import {Routes,Route} from 'react-router-dom'

function MainDocLog() {
  return (
    <div>
      <Header/>
      <Routes>
      <Route path="*" element={<DocSignUp />} />
        <Route  element={<DocLog/>} path="/DocLog" />
      </Routes>
    </div>
  )
}

export default MainDocLog
