import React,{useState} from 'react'
import "./App.css";
import find_my_doc from "./assets/find_my_doc.png"


function DocLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [sub, setSub] = useState(false);
  const [action,setAction]=useState("Sign Up")
  const [email,setEmail]=useState("")
  const [hospital,setHospital]=useState("")
  const [isValid, setIsValid] = useState(null);
  const [errors, setErrors] = useState({});

  const hospitalList = ["City Hospital", "Apollo Hospital", "MedicoCare", "Green Valley Hospital"];

  function change1(e) {
    setUserName(e.target.value);
  }

  function change2(e) {
    setPassword(e.target.value);
  }

  function submit(e) {
    e.preventDefault();
    setSub(true);
    console.log({userName,password,email,hospital})
    setPassword("")
    setUserName("")
    setEmail("")
    setHospital("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email))
    const newErrors = {};

    if (!userName.trim()) newErrors.userName = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!hospital) newErrors.hospital = "Please select a hospital.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
    }
    
  }

  function oldAcc(){
    console.log('clicked')
    setAction("Sign In")
  }

  function change3(e){
    setEmail(e.target.value)
    setIsValid(null)
  }

  function change4(e){
    setHospital(e.target.value)
  }

  
  return (
    <div>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    <div className="navbar">
      <img id="findDoc" src={find_my_doc} alt=""  />
      <h1>Find My Dr</h1>  
    </div> 
    <div id="container">
    <div id="box">

      <div className="header">
        <h1 >{action}</h1>

        {isValid !== null && (
        <p>{isValid ?<div></div> : <span style={{ color: "red" }}>Invalid Email Address!</span>}</p>
      )}
      </div>

      <div className="inputs">
        {action==="Sign In"?<div></div>:
        <div>
          <div className="email">
            <i className="fa-solid fa-envelope"></i>
            <input type="email" onChange={change3} placeholder="Email" value={email} style={{ borderColor: errors.email ? "red" : "" }}></input>
          <br></br><br></br>
          </div>
          <div className="hospital">
            <i className="fa-solid fa-hospital" id="small"></i>
            <select onChange ={change4} placeholder="Hospital" value={hospital} style={{ borderColor: errors.hospital ? "red" : "" }}
              className={hospital ? "has-value" : ""}  >
                <option value="" className='placeholder'>
                  Hospital
                </option>
                {hospitalList.map((hospital, index) => (
                  <option key={index} value={hospital}>
                    {hospital}
                  </option>
                ))}

            </select>
            
            <br></br>
            <br></br>
          </div>
        </div>}

        <div className="username">
          <i className="fa-solid fa-user"></i>
          <input type="text" onChange={change1} placeholder="UserName" value={userName} style={{ borderColor: errors.userName ? "red" : "" }} ></input>
          
          <br></br>
          <br></br>
        </div>

        <div className="password">
          <i className="fa-solid fa-lock"></i>
          <input type="password" onChange={change2} value={password} placeholder="Password" style={{ borderColor: errors.password ? "red" : "" }}></input>
          <br></br><br></br>

        </div>
      </div>
      
      <button id="button" type="submit" onClick={submit} style={{color:'#165e98'}}>Submit</button>
      <br></br>
      {action==='Sign In'?<p>Lost your Password?<span>Click here!</span></p>:<p>Already have an account?<span onClick={oldAcc}>Click to Login</span></p> 
      } 

        </div>
      </div>
      
      <br></br><br></br>
        <br></br><br></br>
    </div>
  )
}

export default DocLogin
