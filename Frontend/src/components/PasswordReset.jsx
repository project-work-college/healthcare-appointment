import React, { useState } from 'react'
import Header from './Header'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordReset() {
    const location = useLocation();
    const email = location.state?.email;
    const otp = location.state?.otp;
    const navigate=useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit,setIsSubmit]=useState(false)
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = Validate({ password,newPassword });  // Validate the inputs
        setFormErrors(errors);  // Set form errors
        setIsSubmit(true);  
        if (Object.keys(errors).length === 0) {

            try {
              console.log("Submitting reset-password with:", { email, otp, newPassword });
                const res = await axios.post("http://localhost:5000/feature/reset-password", {
                  email,
                  otp,
                  newPassword
                });
                if (res.status === 200) {
                  setMessage(res.data.message);
                  alert(`Password successfully updated`);
                  console.log("updated successfully ",res.data);
                  navigate('/SignIn');
                }
              } catch (error) {
                setMessage(error.response?.data?.message || "Something went wrong");
              }
           }
        };

    

    function Validate(values){
        const errors={};
        if (!values.password) {
            errors.password = "Password is required";
            } 
          else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
          } 
          else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
          }
          if (!values.newPassword) {
            errors.rePassword = "Please re-enter your password";
          } else if (values.password !== values.newPassword) {
            errors.newPassword = "Passwords do not match!";
          }
          return errors;
    }
  return (
    <div>
      <Header/>
      <h1 style={{textAlign:"center",marginTop:"30px"}}>Reset Your Password</h1>
        <div id="reset-div">
            <p id="reset-para">Now enter your new password and also re-enter it.And you have come to the end of the process!!</p>
        </div>
        <form onSubmit={handleSubmit} id="reset-form">
            <div id="reset-form-div">
            <input type="password" placeholder="Enter your new password" value={password} style={{ borderColor: formErrors.password ? "red" : "" }} id="reset-input" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div id="reset-form-div">
                <input type="text" placeholder="Re-enter the password" value={newPassword} style={{marginTop:"20px",marginBottom:"10px",borderColor: formErrors.newPassword? "red" : ""
                }} id="reset-input" onChange={(e) => setNewPassword(e.target.value)}/>
            </div>
            <div id="reset-form-div">
                <button type="submit" id="reset-button">Confirm</button>
            </div>
        </form>
        <div style={{height:"50px"}}></div>
         {message && <p>{message}</p>} 
    </div>
  )
}

export default PasswordReset