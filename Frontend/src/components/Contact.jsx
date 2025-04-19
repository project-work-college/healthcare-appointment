import React from 'react'
import HomeHeader from './HomeHeader'
import './contact.css'
import HomeFooter from './HomeFooter'

function Contact() {
  return (
    <div>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <HomeHeader/>
      <h2 id="heading" style={{marginTop:"80px",fontSize:"xx-large"}}>Contact Us</h2>
      <p id="line">We are Here to Find the Best Healthcare Near You!!!</p>
      <p id="line">You can contact us whenever you want to!!!!</p>
      <p id="line" style={{marginTop:"50px"}}><i className="fa-solid fa-phone" />: <a>+91 94004 83256</a></p>
      <p id="line" style={{marginTop:"30px"}}><i className="fa-solid fa-envelope" />: <a>findmydr@gmail.com</a></p>
      <p id="line" style={{marginTop:"30px"}}><i className="fa-brands fa-instagram" />: <a>find_my_dr</a></p>
      <p id="line" style={{marginTop:"30px"}}><i className="fa-brands fa-whatsapp" />: <a>+91 75106 71545</a></p>
      <p id="line" style={{marginTop:"50px"}}>Feel free to contact</p>
      <HomeFooter/>
    </div>
  )
}

export default Contact