import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import Cookies from 'js-cookie';

import { reauthenticate } from "./utils/api";

import Landing from "./pages/shared/Landing";
import Logout from "./pages/shared/Logout";
import Toolbar from "./layouts/Navbar";
import Home from "./pages/shared/Home";
import ManageAccount from "./pages/user/ManageAccount";
import UploadPhotos from "./pages/user/UploadPhotos";
import SortedPhotos from "./pages/user/SortedPhotos";
import UnsortedPhotos from "./pages/admin/UnsortedPhotos";
import ManageFamily from "./pages/admin/ManageFamily";

import './App.css';

const App = () => {
  const [userDetails, setUserDetails] = useState({ familyName: "", email: "", role: "admin" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      if (userDetails.email === "") {
        reauthenticate()
          .then((data: any) => {
            setUserDetails({
              familyName: data.familyName,
              email: data.email,
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
    setUserDetails({ familyName: "", email: "", role: "" });
    Cookies.remove('token');
  };

  return (
    <BrowserRouter>
      <div>
        <main>
          <Container>
            {isLoggedIn ? <Toolbar userRole={userDetails.role} /> :
              <>
                <div style={{ height: '50px' }}></div>
                <h1 className="text-center">Family Photo Organizer</h1>
                <div style={{ height: '50px' }}></div>
              </>
            }
            <Container>
              <Routes>
                {isLoggedIn ? (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/manage-account" element={<ManageAccount userDetails />} />
                    <Route path="/upload-photos" element={<UploadPhotos userDetails />} />
                    <Route path="/sorted-photos" element={<SortedPhotos userDetails />} />
                    <Route path="/manage-family" element={<ManageFamily userDetails />} />
                    <Route path="/unsorted-photos" element={<UnsortedPhotos userDetails />} />
                    <Route path="/logout" element={<Logout onLogoutSuccess={handleLogoutSuccess} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                ) : (
                  <Route path="*" element={<Landing onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleLoginSuccess} onRegisterFamilySuccess={handleLoginSuccess} />} />
                )}
              </Routes>
            </Container>
            {isLoggedIn ? <Toolbar userRole={'footer'} /> : null}
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;