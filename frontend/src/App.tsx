import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import { logout, getUserInfo, reauthenticate } from "./utils/firebase-auth";

import Landing from "./pages/shared/Landing";
import Toolbar from "./layouts/Navbar";
import Home from "./pages/shared/Home";
import ManageAccount from "./pages/user/ManageAccount";
import UploadPhotos from "./pages/user/UploadPhotos";
import SortedPhotos from "./pages/user/SortedPhotos";
import UnsortedPhotos from "./pages/admin/UnsortedPhotos";
import ManageFamily from "./pages/admin/ManageFamily";

import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    reauthenticate().then((response: any) => {
      if (response.status === 'success') {
        handleLoginSuccess();
      }
    });
  }, []);

  const handleRegisterSuccess = () => {
    window.location.reload();
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    const uid = sessionStorage.getItem('uid');
    console.log(uid);
    if (uid) {
      getUserInfo(uid).then((response: any) => {
        if (response.status === 'error') {
          console.error(response.message);
        } else {
          setUserRole(response.role);
          console.log(response);
        }
      });
    }
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    logout();
  };

  return (
    <BrowserRouter>
      <div>
        <main>
          <Container>
            {isLoggedIn ? <Toolbar userRole={userRole} onLogoutSuccess={handleLogoutSuccess} /> :
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
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                ) : (
                  <Route path="*" element={<Landing onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleRegisterSuccess} onRegisterFamilySuccess={handleRegisterSuccess} />} />
                )}
              </Routes>
            </Container>
            {isLoggedIn ? <Toolbar userRole={'footer'} onLogoutSuccess={handleLogoutSuccess} /> : null}
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}


export default App;