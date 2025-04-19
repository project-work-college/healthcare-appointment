import React,{useState,useEffect} from 'react'
import './symptomList.css'
import HomeHeader from './HomeHeader'
import HomeFooter from './HomeFooter'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {useAuth} from './AuthContext';
import SignIn from './SignIn';
function SymptomList() {
  const { isAuthenticated} = useAuth();
  const initValues={name:"",age:"",symptom:""}
  const [formErrors, setFormErrors] = useState({});
  const [formValue, setFormValue] = useState(initValues)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isVisible,setIsVisible]=useState(false)
  const navigate=useNavigate();
  
  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  
  async function  handleSubmit(e) {
    e.preventDefault();
    const errors=Validate(formValue);
    setFormErrors(errors);
    if (Object.keys(errors).length !== 0) {
      return; // Stop submission if there are validation errors
  }
  try{
    // Retrieve appointmentId stored in localStorage
    const appointmentId = localStorage.getItem("appointmentId");

    if (!appointmentId) {
      alert("No appointment found to confirm. Please book an appointment first.");
      return;
    }

    const requestBody = {
      appointmentId,
      name: formValue.name,
      age: formValue.age,
      symptoms: formValue.symptom, // Make sure this matches backend expectations
    };

    // Send confirmation request
    const response = await axios.post("http://localhost:5000/doctor/submit",
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Appointment confirmed:", response.data);
    //alert("Your appointment has been confirmed!");

    // Clear localStorage after confirmation
    localStorage.removeItem("appointmentId");
    //console.log(formValue);
    setIsSubmit(true);
    alert("Your appointment has been confirmed successfully ");
    navigate('/HomeBody');

  }catch (error) {
    console.error("Error confirming appointment:", error.response?.data || error.message);
    alert("Failed to confirm appointment. Please try again.");
  }

    
  }

  function Validate(values){ //mainly to check if there is any error or to find if any empty fields
      const errors={}
      //to check if username field is not empty
      if (!values.name) errors.name = "Name is required.";
  
      if (!values.age) {
        errors.age = "age is required";
      }
      else if (!/^\d+$/.test(values.age)) errors.age = "Age must be a number.";
    else if (parseInt(values.age) < 1 || parseInt(values.age) > 120) errors.age = "Enter a valid age (1-120).";
      if (!values.symptom) {
        errors.symptom = "symptom is required";
      }
      return errors;
    }
  
    useEffect(() => {
      console.log(formErrors);
      setFormValue(initValues);
    }, [formErrors]);//dependency array
  

  return (
    <div>
      {isAuthenticated ? (
        <div>
      <HomeHeader/>
      <h1 id="enter">Enter your details...</h1>
      <form id="form" onSubmit={handleSubmit}>
            <div id="middle">
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="name" placeholder="Name" 
                value={formValue.name} style={{ borderColor: formErrors.name ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="age" placeholder="Age" 
                value={formValue.age} style={{ borderColor: formErrors.age ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="symptom" placeholder="Symptoms" 
                value={formValue.symptom} style={{ borderColor: formErrors.symptom ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            <br></br>
            <button id="sub-but" type="submit" style={{ backgroundColor: '#165e98',marginLeft:"55px",border:"none",color:"white" }}>Submit</button>
            </div>
        </form>
        <div style={{height:"50px"}}></div>
      <HomeFooter/>
    </div>):(<div><SignIn/></div>)}
    </div>
  )
}

export default SymptomList
