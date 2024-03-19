import React, { useState } from 'react';
import { Button, Container, Label } from 'reactstrap';
import Login from './Login';
import Register from './Register';

const Landing = (props: { onLoginSuccess: any; onRegisterSuccess: any; onRegisterFamilySuccess: any; }) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => {
        setIsLogin(!isLogin);
    };

    return (
        <Container>
            {isLogin ? (
                <Login onLoginSuccess={props.onLoginSuccess} />
            ) : (
                <Register 
                    onRegisterSuccess={props.onRegisterSuccess}
                    onRegisterFamilySuccess={props.onRegisterFamilySuccess} 
                />
            )}
            <div style={{ height: '20px' }}></div>
            <Label>
                {isLogin ? 'Need an account?' : 'Already have an account?'}
            </Label>
            <div style={{ height: '10px' }}></div>
            <Button onClick={toggleLogin} color="primary">
                {isLogin ? 'Register' : 'Login'}
            </Button>
        </Container>
    );
};

export default Landing;