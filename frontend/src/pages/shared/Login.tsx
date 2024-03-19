import React, { useState } from 'react';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';
import { login } from '../../utils/firebase/auth';
import { Button, Form, FormGroup, Input, Container } from 'reactstrap';

const Login = (props: any) => {
    const [familyName, setFamilyName] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [successMessages, setSuccessMessages] = useState<string[]>([]);

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
        login(familyName, email, password)
            .then(response => {
                if (response && response.status === 'error') {
                    setErrorMessages([response.message]);
                } else {
                    setSuccessMessages([response.message]);
                    props.onLoginSuccess();
                }
            })
            .catch(error => {
                setErrorMessages([error]);
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
                <ErrorMessagesDisplay errorMessages={errorMessages} />
                <SuccessMessageDisplay successMessages={successMessages} />
                <Button type="submit" color="success">Login</Button>
            </Form>
        </Container>
    );
};

export default Login;