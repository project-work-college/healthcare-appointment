import "./App.css";
import React,{useState} from "react";
import { Route,Routes,useNavigate} from "react-router-dom";
import find_my_doc from "./assets/find_my_doc.png"
import doctor from "./doctor.jpg"

function App(){


  const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [sub, setState] = useState(null)
    const [action,setAction]=useState("Sign Up")
    const [email,setEmail]=useState("")
    const [isValid, setIsValid] = useState(null);
    const [errors, setErrors] = useState({});
    const [hospital,setHospital]=useState("")

    const hospitalList = ["City Hospital", "Apollo Hospital", "MedicoCare", "Green Valley Hospital"];
  
    function change1(e) {
      setUserName(e.target.value);
    }
  
    function change2(e) {
      setPassword(e.target.value);
    }
  
    function submit(e) {
      e.preventDefault();
      // setState(true);
      console.log({userName,password,email})
      setPassword("")
      setUserName("")
      setEmail("")
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
  
    function changeToDoc(){
      setState('Doc')
    }

    function changeToUser(){
      setState('User')
    }
  
  return (

    <>
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    <div className="navbar">   
      <img id="findDoc" src={find_my_doc} alt=""  />
      <h1 id="navhead">Find My Dr</h1>
      {sub===null?
      <div>
        <div id="boxes">
        <button className="pic1" id="pic1" 
          onClick={changeToDoc}
          style={{
          float: "left",
          width: "200px",
          height: "200px",
          backgroundColor: "white",}}>
        </button>
        <div style={{height:"150px",width:"150px"}}></div>
        <button className="pic2" id="pic1" 
        onClick={changeToUser}
        style={{
          float: "left",
          width: "200px",
          height: "200px",
          backgroundColor: "white"}}>
        </button>
      </div>
      <div id="text">
        <p id="login" style={{
          float: "left",
          width: "150px",
          height: "30px",}}>Login as Admin</p>
        <p id="login"  style={{
          float: "left",
          width: "150px",
          height: "30px",
          marginLeft:"200px",}}>Login as User</p>
        </div>
      </div>:
        <div>
      
        {sub==='User'?
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
                  <div className="email">
                  <i className="fa-solid fa-envelope"></i>
                  <input type="email" onChange={change3} value={email} placeholder="Email" style={{ borderColor: errors.email ? "red" : "" }}></input>
                  <br></br><br></br>
        
                </div>}
        
                <div className="username">
                  <i className="fa-solid fa-user"></i>
                  <input type="text" onChange={change1} placeholder="UserName" value={userName} style={{ borderColor: errors.userName ? "red" : "" }}></input>
        
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
            :
              <div>
                
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
        
              </div>}

</div>  
      }

    </div>
    </>
  )
}

export default App