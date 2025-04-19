import React from 'react'
import './header.css'
import find_my_doc from "../assets/find_my_doc.png"

function Header() {
  return (
    <div>
      <div className="navbar">   
              <img id="find" src={find_my_doc} alt=""  />
              <h1 id="navhead">Find My Dr</h1>
            </div>
    </div>
  )
}

export default Header
