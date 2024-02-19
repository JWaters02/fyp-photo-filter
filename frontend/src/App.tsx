import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import Cookies from 'js-cookie';
import Landing from "./pages/Landing";
import Logout from "./pages/Logout";
import Toolbar from "./layouts/Navbar";
import Home from "./pages/Home";
import ManageAccount from "./pages/ManageAccount";
import UploadPhotos from "./pages/UploadPhotos";
import SortedPhotos from "./pages/SortedPhotos";
import ManageFamily from "./pages/ManageFamily";
import { reauthenticate } from "./api";
import './App.css';

const App = () => {
  const [userDetails, setUserDetails] = useState({ familyName: "", email: "", username: "", role: "" });
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
    setUserDetails({ familyName: "", email: "", username: "", role: "" });
    Cookies.remove('token');
  };

  return (
    <BrowserRouter>
      <div>
        <main>
          <Container>
            <Toolbar userRole={userDetails.role} />
            <Container>
              <Routes>
                {isLoggedIn ? (
                  <>
                    <Route path="/" element={<Home/>} />
                    <Route path="/manage-account" element={<ManageAccount userDetails />} />
                    <Route path="/upload-photos" element={<UploadPhotos userDetails />} />
                    <Route path="/sorted-photos" element={<SortedPhotos userDetails />} />
                    <Route path="/manage-family" element={<ManageFamily userDetails />} />
                    <Route path="/logout" element={<Logout onLogoutSuccess={handleLogoutSuccess} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                ) : (
                  // If not logged in, redirect all routes to the landing page
                  <Route path="*" element={<Landing onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleLoginSuccess} onRegisterFamilySuccess={handleLoginSuccess} />} />
                )}
              </Routes>
            </Container>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;