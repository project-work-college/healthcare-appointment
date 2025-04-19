import React from 'react'
import { BrowserRouter as Router,Route,Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import FrontPage from './FrontPage'
import MainDocLog from './MainDocLog'
import DocLog from './components/DocLog'
import DocSignUp from './components/DocSignUp'
import MainUser from './MainUser'
import UserLog from './components/UserLog'

function App3() {
  return (
    <div>
      <Routes>
        
        <Route path='*' element={<FrontPage/>}/>
        <Route path='/MainDocLog/*' element={<MainDocLog/>}/>
        <Route path="/DocSignUp" element={<DocSignUp />} />
        <Route  element={<DocLog/>} path="/DocLog" />
        <Route path='/MainUser' element={<MainUser/>}/>
        <Route path="/UserLog" element={<UserLog />} />
      </Routes>
        
    </div>
  )
}

export default App3
