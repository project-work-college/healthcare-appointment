import React, { useState } from 'react'
import Header from './Header'
import './reset.css'
import axios from "axios";
import { Route, Routes, useNavigate } from 'react-router-dom';
import PasswordReset from './PasswordReset';


function Reset() {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit,setIsSubmit]=useState(false)
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [action,setAction]=useState(false);

const otpcheck=async ()=>{
  const errors = Validate({ email, otp }); 
  setFormErrors(errors);
  if (Object.keys(errors).length === 0) {
    try {
      const res = await axios.post("http://localhost:5000/feature/verify-otp", { email, otp });

      // If success, navigate
      console.log("OTP verified successfully");
      navigate("/PasswordReset", { state: { email, otp } });

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      console.log("OTP verification failed");
    }
  } else {
    console.log("Enter valid OTP of 6 digits");
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = Validate({ email });  // Validate the form
    setFormErrors(errors);  // Set form errors
    setIsSubmit(true);  
    if (Object.keys(errors).length === 0) {
      setAction(true);
      alert(`otp has been successfully sent to ${email}`);
      try {
        const res = await axios.post("http://localhost:5000/feature/forgot-password", { email });
        setMessage(res.data.message);
        console.log(res.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
      return; // Stop if there are validation errors
    }
    
  };

  function Validate(values){ //mainly to check if there is any error or to find if any empty fields
    const errors={}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const otpRegex = /^\d{6}$/
    if(action===true){
      if (!values.otp) {
        errors.otp = "OTP is required!";
      } else if (!otpRegex.test(values.otp)) {
        errors.otp = "OTP must be exactly 6 digits!";
      }
    }
    if (!values.email) {   //email is not blank
      errors.email = "Email is required!";
    } 
    else if (!regex.test(values.email)) {   
      errors.email = "This is not a valid email format!";
    }
    return errors;
  }

  return (
    <div>
        <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
        <Header/>
        <h1 style={{textAlign:"center",marginTop:"30px"}}>Reset Your Password</h1>
        <div id="reset-div">
            <p id="reset-para">To reset your password, enter your email below and click on the reset link button. An email with an OTP will be sent to you and enter the corresponding OTP in its field.</p>
        </div>
        <form onSubmit={handleSubmit} id="reset-form">
            <div id="reset-form-div">
            <input type="email" placeholder="Enter your email" value={email} id="reset-input" onChange={(e) => setEmail(e.target.value)} style={{ borderColor: formErrors.email ? "red" : "" }} required />
            </div>
            {action?
              <div>
                <div id="reset-form-div">
                  <input type="text" placeholder="Enter the OTP" value={otp} style={{marginTop:"20px",marginBottom:"10px",borderColor: formErrors.otp ? "red" : ""
                  }} id="reset-input" onChange={(e) => setOtp(e.target.value)}/>
              </div>
              <div id="reset-form-div">
                  <button type="submit" id="reset-button" onClick={()=>otpcheck()}>Submit</button>
              </div>
              </div>:
              <div>
                <div id="reset-form-div">
                  <button type="submit" id="reset-button">Send Reset Link</button>
              </div>
              </div>}
        </form>
        <div style={{height:"100px"}}></div>
        {/* {message && <p>{message}</p>} */}
        <Routes>
          <Route path='/PasswordReset' element={<PasswordReset/>}/>
        </Routes>
    </div>
  )
}

export default Reset
