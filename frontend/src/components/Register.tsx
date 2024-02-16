import React, { useState } from 'react';
import { ErrorMessagesDisplay } from './AlertDisplays';
import { register } from '../api';
import { Button, Form, FormGroup, Input, Label, Container } from 'reactstrap';

type UserData = {
    username: string;
    email: string;
    password: string;
    password2: string;
    familyName?: string; // Optional property for existing family
    lastName?: string;   // Optional property for new family
};

const Register = (props: { onRegisterSuccess: any; onRegisterFamilySuccess: any; }) => {
    const [isRegisterFamily, setIsRegisterFamily] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const toggleRegisterFamily = () => {
        setIsRegisterFamily(!isRegisterFamily);
        setFamilyName('');
        setLastName('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'familyName':
                setFamilyName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'password2':
                setPassword2(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let userData: UserData = { username, email, password, password2 };

        if (isRegisterFamily) {
            userData.familyName = familyName;
            // Call the appropriate API to handle family registration
        } else {
            userData.lastName = lastName;
            register(userData)
            .then(response => {
                if (response && response.status === 'error') {
                    setErrorMessages(response.errorMessages);
                } else {
                    props.onRegisterSuccess(response);
                }
            })
            .catch(error => {
                console.error("Register error", error);
            });
        }
    };

    return (
        <Container>
            <Container>
                <Form onSubmit={handleSubmit}>
                    {isRegisterFamily ? (
                        <FormGroup>
                            <Input
                                type="text"
                                name="familyName"
                                value={familyName}
                                onChange={handleChange}
                                placeholder="Family Name"
                            />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <Input
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                        </FormGroup>
                    )}
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
                            type="email"
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
                    <FormGroup>
                        <Input
                            type="password"
                            name="password2"
                            value={password2}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                        />
                    </FormGroup>
                    <Button type="submit" color="primary">
                    {isRegisterFamily ? (
                        "Register Family"
                    ) : (
                        "Register Individual"
                    )}
                    </Button>
                </Form>
            </Container>
            <br />
            <Label>
                {isRegisterFamily ? 'Registering a new family?' : 'Registering as an individual to join your family?'}
            </Label>
            <br />
            <Button onClick={toggleRegisterFamily} color="primary">
                {isRegisterFamily ? 'Register New Family' : 'Register Into Existing Family'}
            </Button>
            <br />
            <ErrorMessagesDisplay errorMessages={errorMessages} />
        </Container>
    );
};

export default Register;