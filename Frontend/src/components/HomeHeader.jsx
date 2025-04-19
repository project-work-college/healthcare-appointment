import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import findDoc from "../assets/findDoc.png";
import SignIn from "./SignIn";
import Contact from "./Contact";
import About from "./About";
import Service from "./Service";
import "./homeHeader.css";
import { useAuth } from "./AuthContext";
import HomeBody from "./HomeBody";
import user from '../Unwanted/user.jpg'

function HomeHeader() {
    const navigate = useNavigate();
    //const { isAuthenticated,setIsAuthenticated } = useAuth(); 
    const { isAuthenticated, setIsAuthenticated, userData, setUserData, logout } = useAuth();
    const location = useLocation();
    const [active, setActive] = useState("");
    const [open, setOpen] = useState(false);
    const handleclick = () => {
        setOpen(!open);
    }

    // Update active state based on current location
    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);

    const clickEvent = (e, path) => {
        e.preventDefault();
        navigate(path);
    };

    const handleLogout = () => {
        logout(); // ✅ Calls our global logout function
        setOpen(false); // ✅ Close profile box if needed
        navigate("/"); // ✅ Redirect to home or login page
    };

    return (
        <div>
            <div className="nav">
                <img id="findDoc" src={findDoc} alt="" />
                <div id="findDr" style={{ width: "250px" }}>Find My Dr</div>

                <nav className="newnav">
                    <a
                        onClick={(e) => { isAuthenticated ? clickEvent(e, "/HomeBody") : clickEvent(e, "/") }}
                        className={active === "/" || active === "/HomeBody" ? "update" : ""}
                    >
                        HOME
                    </a>
                    <a
                        onClick={(e) => clickEvent(e, "/About")}
                        className={active === "/About" ? "update" : ""}
                    >
                        ABOUT
                    </a>
                    <a
                        onClick={(e) => clickEvent(e, "/Contact")}
                        className={active === "/Contact" ? "update" : ""}
                    >
                        CONTACT
                    </a>
                    <a
                        onClick={(e) => clickEvent(e, "/Service")}
                        className={active === "/Service" ? "update" : ""}
                    >
                        SERVICE
                    </a>
                </nav>

                {/* <button id="user" onClick={() => navigate("/SignIn")}>Log In</button> */}
                {isAuthenticated ? (
                    // ✅ Show round div when logged in
                    <button id="userIcon" style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%"
                    }} onClick={handleclick}></button>
                ) : (
                    // Show Log In button if not logged in
                    <button id="user" onClick={() => navigate("/SignIn")}>Log In</button>
                )}
            </div>
            {open && (
                <div id="prof-box">
                    <div id="user-image-box">
                        <img src={user} id="user-img"></img>
                    </div>
                    <div id="details-prof">
                        <p>{userData?.username || "Username"}</p>
                        <p>{userData?.email || "Email"}</p>
                        <button id="logout" onClick={handleLogout} >Logout</button>
                    </div>
                </div>
            )}
            <Routes>
                <Route path="/HomeBody" element={<HomeBody />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/Contact/*" element={<Contact />} />
                <Route path="/About/*" element={<About />} />
                <Route path="/Service/*" element={<Service />} />
            </Routes>
        </div>
    );
}

export default HomeHeader;
