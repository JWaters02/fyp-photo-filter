import React, { useState } from 'react';
import { Button, Container, Label } from 'reactstrap';
import Login from './Login';
import Register from './Register';

const Landing = (props: { onLoginSuccess: any; onRegisterSuccess: any; }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => {
        setIsLogin(!isLogin);
    };

    return (
        <Container>
            {isLogin ? (
                <Login onLoginSuccess={props.onLoginSuccess} />
            ) : (
                <Register onRegisterSuccess={props.onRegisterSuccess} />
            )}
            <br />
            <Label>
                {isLogin ? 'Need an account?' : 'Already have an account?'}
            </Label>
            <br />
            <Button onClick={toggleLogin} color="primary">
                {isLogin ? 'Register' : 'Login'}
            </Button>
        </Container>
    );
};

export default Landing;
