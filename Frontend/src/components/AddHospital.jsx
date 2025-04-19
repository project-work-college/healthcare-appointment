import React, { useState ,useEffect} from 'react'
import DoctorHeader from './DoctorHeader'
import './addDr.css'
import { useNavigate,useLocation, Routes, Route,Navigate } from 'react-router-dom'
import HomeFooter from './HomeFooter';
import { useAuth } from "./AuthContext";
import SignIn from './SignIn';
import axios from "axios";

function AddHospital() {
    const { isAuthenticated, userData,setUserData } = useAuth();
    // const location = useLocation();
    // const selectedDept = location.state?.dept?.name || "";
    const initValues={name:"",location:"",email:""}
    const [formErrors, setFormErrors] = useState({});
    const [formValue, setFormValue] = useState(initValues)
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate=useNavigate();

    // const [selectedDays, setSelectedDays] = useState([]);
    // const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if(!isAuthenticated){
        return <Navigate to="/SignIn" replace />;

    }

    const handleChange=(e)=>{
        const { name, value } = e.target;
        
        setFormValue({ ...formValue, [name]: value });
        }
          
    
    function  handleSubmit(e) {
        e.preventDefault();
        const errors=Validate(formValue);
        setFormErrors(errors);
        if (Object.keys(errors).length !== 0) {
          return; // Stop submission if there are validation errors
        }
        
        const cleanedName = formValue.name.replace(/^Dr\s+/i, "") // Remove "Dr" if present
        .replace(/\s+/g, " ")    // Ensure single spaces between words
        .replace(/\./g, "");     // Remove dots (.)

        const nameParts = cleanedName.split(" "); // Split into words
        const firstWord = nameParts[0] || ""; // Get the first word safely

        const namePart = firstWord.length < 7 ? firstWord : firstWord.substring(0, 6);
        const uniqueId = Math.floor(100 + Math.random() * 900); // 3-digit random number

        const username = namePart + uniqueId;
        const password = username.toLowerCase();

        console.log("Username:", username);
        console.log("Password:", password);


        const hospitalData = {
            ...formValue,
            username: username,  // ✅ Add username
            password: password, // ✅ Add password
            // role:"hospitalAdmin"   
        };
        

        const sendDoctorData = async () => {
            try {
                console.log(hospitalData);
                const response = await axios.post("http://localhost:5000/hospital/addhospital", hospitalData);
               alert("Successfully added a hospital!");
               navigate('/AdminBody');
                console.log("Server Response:", response.data);
               
                
            } catch (error) {
                console.error("Error adding doctors:", error.response?.data || error.message);
                alert("Failed to add hospital. Please try again.");
            }
        };
        sendDoctorData(); // ✅ Call the async function
    }
    function Validate(values){ //mainly to check if there is any error or to find if any empty fields
        const errors={}
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //to check if username field is not empty
        if (!values.name) errors.name = "Name is required.";
    
        
        if (!values.location) {
            errors.location = "Location is required";
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        
      <DoctorHeader/>
      {/* <div id="back-button" style={{fontSize:"20px"}}onClick={()=>navigate('/DeptList')}>
        <button style={{backgroundColor:"white",border:"1px solid #165e98",borderRadius:"3px",color:"#165e98"}}>Prev</button>
      </div> */}
      <h1 id="edit-head" style={{marginTop:"70px"}}>Add a hospital</h1>
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
                name="location" placeholder="Location" 
                value={formValue.location} style={{ borderColor: formErrors.location ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="email" placeholder="Email" 
                value={formValue.email} style={{ borderColor: formErrors.email ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            {/* <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="qualification" placeholder="Qualification" 
                value={formValue.qualification} style={{ borderColor: formErrors.qualification ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div> */}
            {/* <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="fee" placeholder="Fees" 
                value={formValue.fee} style={{ borderColor: formErrors.fee ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div> */}
            {/* <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="year" placeholder="Year of Experience" 
                value={formValue.year} style={{ borderColor: formErrors.year ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div> */}
            {/* <br></br>
            <div className="name">
                <input type="text" 
                onChange={handleChange} 
                name="Slots" placeholder="Slot.Eg:9:00 AM-11:00 AM" 
                value={formValue.Slots}
 
                style={{ borderColor: formErrors.Slots ? "red" : "" }}
                ></input>
                <br></br><br></br>
            </div>
            <br></br> */}
            {/* <div id="avail-box">
            <div className="name" id="checkdiv">
                <p style={{fontSize:"larger",color:"#165e98"}}>Availability:</p>
                {days.map((day) => (
                    <label key={day} style={{ marginRight: "10px" }} id="checkbox-label ">
                        <input type="checkbox" value={day} 
                        checked={selectedDays.includes(day)} id="daycheck" style={{marginRight:"5px"}}
                        onChange={handleCheckboxChange}/>
                          {day}
                    </label>
                ))}
                {formErrors.availability && <p style={{ color: "red" }}>{formErrors.availability}</p>}
            </div>
            </div> */}

            <br></br>
            <button id="sub-but" type="submit" style={{ backgroundColor: '#165e98',marginLeft:"55px",border:"none",color:"white" }}>Submit</button>
            </div>
        </form>
        <HomeFooter/>
    <Routes>
        {/* <Route path="/DeptList" element={<DeptList/>}/> */}
    </Routes>
    </div>
  )
}

export default AddHospital;