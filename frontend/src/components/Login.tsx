import React, { useState } from 'react';
import { ErrorMessagesDisplay } from './AlertDisplays';
import { login } from '../api';
import { Button, Form, FormGroup, Input, Container } from 'reactstrap';

const Login = (props: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userCredentials = { username, password };
        login(userCredentials)
            .then(response => {
                if (response && response.status === 'error') {
                    setErrorMessages(response.errorMessages);
                } else {
                    props.onLoginSuccess(response);
                }
            })
            .catch(error => {
                console.error("Login error", error);
            });
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                </FormGroup>
                <Button type="submit" color="primary">Login</Button>
            </Form>
            <br />
            <ErrorMessagesDisplay errorMessages={errorMessages} />
        </Container>
    );
};

export default Login;