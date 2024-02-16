import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap';
import Cookies from 'js-cookie';
import Landing from "./components/Landing";
import Logout from "./components/Logout";
import { reauthenticate } from "./api";
import './App.css';

const App = () => {
  const [userDetails, setUserDetails] = useState({email: "", username: ""});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      if (userDetails.email === "") {
        reauthenticate()
          .then((data: any) => {
            setUserDetails({
              email: data.email,
              username: data.username
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
    setUserDetails({email: "", username: ""});
  };

  return (
    <div>
      <main>
        <Container>
          <h1 className="text-black text-center my-4">Photo System Thingy</h1>
          <Row>
            <Col className="mx-auto p-0 card-container">
              <Card>
                <CardBody>
                  {!isLoggedIn ? (
                    <Landing
                      onLoginSuccess={handleLoginSuccess}
                      onRegisterSuccess={handleLoginSuccess}
                      onRegisterFamilySuccess={handleLoginSuccess}
                    />
                  ) : (
                    <Logout onLogoutSuccess={handleLogoutSuccess} />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default App;