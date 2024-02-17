import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap';
import Cookies from 'js-cookie';
import Landing from "./pages/Landing";
import Logout from "./pages/Logout";
import Toolbar from "./layouts/Navbar";
import { reauthenticate } from "./api";
import './App.css';

const App = () => {
  const [userDetails, setUserDetails] = useState({familyName: "", email: "", username: "", role: ""});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      if (userDetails.email === "") {
        reauthenticate()
          .then((data: any) => {
            setUserDetails({
              familyName: data.familyName,
              email: data.email,
              username: data.username,
              role: data.role
            });
          })
          .catch((error: any) => console.log(error));
      }
      setIsLoggedIn(true);
    }
  }, [userDetails.email]);

  const handleLoginSuccess = (details: any) => {
    setUserDetails(details);
    setIsLoggedIn(true);
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setUserDetails({familyName: "", email: "", username: "", role: ""});
    Cookies.remove('token');
  };

  return (
    <BrowserRouter>
      <div>
        {isLoggedIn && <Toolbar userRole={userDetails.role} />}
        <main>
          <Container>
            <h1 className="text-black text-center my-4">Photo System Thingy</h1>
            <Routes>
              {isLoggedIn ? (
                // If logged in, show the app's routes
                <>
                  <Route path="/logout" element={<Logout onLogoutSuccess={handleLogoutSuccess} />} />
                  {/* Add more private routes here */}
                  <Route path="*" element={<Navigate to="/logout" />} /> {/* Redirect any undefined route to /logout or a dashboard page */}
                </>
              ) : (
                // If not logged in, redirect all routes to the landing page
                <Route path="*" element={<Landing onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleLoginSuccess} onRegisterFamilySuccess={handleLoginSuccess} />} />
              )}
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;