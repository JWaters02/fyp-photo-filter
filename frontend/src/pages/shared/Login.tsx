import React, { useState } from 'react';
import { ErrorMessagesDisplay } from '../../components/AlertDisplays';
import { login } from '../../utils/api';
import { Button, Form, FormGroup, Input, Container } from 'reactstrap';

const Login = (props: any) => {
    const [familyName, setFamilyName] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'familyName':
                setFamilyName(value);
                break;
            case 'email':
                setemail(value);
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
        const userCredentials = { familyName, email, password };
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
                        name="familyName"
                        value={familyName}
                        onChange={handleChange}
                        placeholder="Family Name"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
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
                <Button type="submit" color="success">Login</Button>
            </Form>
            <br />
            <ErrorMessagesDisplay errorMessages={errorMessages} />
        </Container>
    );
};

export default Login;