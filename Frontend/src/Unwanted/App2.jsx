import {useState,useEffect} from 'react'
import './App.css'
import {Route,useNavigate,Routes} from 'react-router-dom'
import find_my_doc from "./assets/find_my_doc.png"



function App2() { 
  const initValues={userName:"",email:"",password:""}
  const [formErrors, setFormErrors] = useState({});
  const [formValue,setFormValue]=useState(initValues)
  const [isSubmit,setIsSubmit]=useState(false)
  const [hospital,setHospital]=useState("")
  const [sub,setState]=useState(null)
  const [action,setAction]=useState("Sign Up")
  
  //list of hospitals
  const hospitalList = ["City Hospital", "Apollo Hospital", "MedicoCare", "Green Valley Hospital"];
   
  //for handling multiple inputs
  function handleChange(e){
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setFormErrors(Validate(formValue))
    setIsSubmit(true);   //attempt to submit the form
  }
      
  function Validate(values){ //mainly to check if there is any error or to find if any empty fields
    const errors={}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //to check if username field is not empty
    if (!values.userName) errors.userName = "Username is required.";
    if(action==='Sign Up'){
      if (!values.email) {   //email is not blank
        errors.email = "Email is required!";
      } 
      else if (!regex.test(values.email)) {   
        errors.email = "This is not a valid email format!";
      }
    }
    if (!values.password) {
      errors.password = "Password is required";
      } 
    else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } 
    else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if(sub==='Doc' && action==='Sign Up')  {
      if (!hospital) errors.hospital = "Please select a hospital.";
    }
    return errors;
  }
    
  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {   //no error useeff
      console.log(formValue);
    }
    setFormValue(initValues);
  }, [formErrors]);//dependency array


  function oldAcc(){ //click to login
    console.log('clicked')
    setAction("Sign In")
  }

  function change4(e){ //note the hospital value
    setHospital(e.target.value)
  }
    
  function changeToDoc(){ //change to admin login
    setState('Doc')
  }
  
  function changeToUser(){ //change to user login
    setState('User')
  }
    
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
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
            </div>
            :
            <div>
            {sub==='User'?
              <div id="container">
                <div id="box">
            
                  <div className="header">
                    <h1 >{action}</h1>
                    {Object.keys(formErrors).length === 0 && isSubmit ? (
                    // alert("Successful")
                    <div></div>
                    ) : <div></div>}
                  </div>
            
                  <div className="inputs">
                    {action==="Sign In"?<div></div>:
                      <div className="email">
                      <i className="fa-solid fa-envelope"></i>
                      <input type="text" onChange={handleChange} name="email" value={formValue.email} placeholder="Email" style={{ borderColor: formErrors.email ? "red" : "" }}></input>
                      <br></br><br></br>
            
                    </div>}
            
                    <div className="username">
                      <i className="fa-solid fa-user"></i>
                      <input type="text" onChange={handleChange} name="userName" placeholder="UserName" value={formValue.userName} style={{ borderColor: formErrors.userName ? "red" : "" }}></input>
            
                      <br></br>
                      <br></br>
                    </div>
            
                    <div className="password">
                      <i className="fa-solid fa-lock"></i>
                      <input type="password" name="password" onChange={handleChange} value={formValue.password} placeholder="Password" style={{ borderColor: formErrors.password ? "red" : "" }}></input>
                      <br></br><br></br>
            
                    </div>
            
                  </div>
                  
                  <button id="button" type="submit" onClick={handleSubmit} style={{color:'#165e98'}}>Submit</button>
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
                      {Object.keys(formErrors).length === 0 && isSubmit ? (
                    // alert("Successful") 
                      <div></div>
                      ) : <div></div>}
                    </div>
                      <div className="inputs">
                          {action==="Sign In"?<div></div>:
                            <div>
                          <div className="email">
                      <i className="fa-solid fa-envelope"></i>
                      <input type="text" onChange={handleChange} name="email" value={formValue.email} placeholder="Email" style={{ borderColor: formErrors.email ? "red" : "" }}></input>
              <br></br><br></br>
              </div>
              <div className="hospital">
                <i className="fa-solid fa-hospital" id="small"></i>
                <select onChange ={change4} placeholder="Hospital" value={hospital} style={{ borderColor: formErrors.hospital ? "red" : "" }}
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
                      <input type="text" onChange={handleChange} name="userName" placeholder="UserName" value={formValue.userName} style={{ borderColor: formErrors.userName ? "red" : "" }}></input>
            
                      <br></br>
                      <br></br>
                    </div>
            
                    <div className="password">
                      <i className="fa-solid fa-lock"></i>
                      <input type="password" name="password" onChange={handleChange} value={formValue.password} placeholder="Password" style={{ borderColor: formErrors.password ? "red" : "" }}></input>
                      <br></br><br></br>
            
                    </div>
          </div>

          <button id="button" type="submit" onClick={handleSubmit} style={{color:'#165e98'}}>Submit</button>
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

export default App2;
