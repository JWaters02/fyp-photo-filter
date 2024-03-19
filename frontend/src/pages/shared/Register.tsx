import React, { useState } from 'react';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';
import { registerFamilyAdmin, registerFamilyUser } from '../../utils/firebase/auth';
import { Button, Form, FormGroup, Input, Label, Container } from 'reactstrap';

const Register = (props: { onRegisterSuccess: any; onRegisterFamilySuccess: any; }) => {
    const [isRegisterFamily, setIsRegisterFamily] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [familyLastName, setFamilyLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [successMessages, setSuccessMessages] = useState<string[]>([]);

    const toggleRegisterFamily = () => {
        setIsRegisterFamily(!isRegisterFamily);
        setFamilyName('');
        setFamilyLastName('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'familyName':
                setFamilyName(value);
                break;
            case 'familyLastName':
                setFamilyLastName(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
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

        if (isRegisterFamily) {
            registerFamilyAdmin(familyLastName, email, password, password2)
                .then(response => {
                    if (response && response.status === 'error') {
                        setErrorMessages([response.message]);
                    } else {
                        setSuccessMessages([response.message]);
                    }
                })
                .catch(error => {
                    console.error("Register error", error);
                });
        } else {
            registerFamilyUser(familyName, firstName, lastName, email, password, password2)
                .then(response => {
                    if (response && response.status === 'error') {
                        setErrorMessages(response.message ? [response.message] : []);
                    } else {
                        setSuccessMessages([response.message]);
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
                                name="familyLastName"
                                value={familyLastName}
                                onChange={handleChange}
                                placeholder="Last Name" />
                        </FormGroup>
                    ) : (
                        <>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="familyName"
                                    value={familyName}
                                    onChange={handleChange}
                                    placeholder="Family Name" />
                            </FormGroup>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    onChange={handleChange}
                                    placeholder="First Name" />
                            </FormGroup>
                            <FormGroup>
                                <Input
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name" />
                            </FormGroup>
                        </>
                    )}
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
                    <ErrorMessagesDisplay errorMessages={errorMessages} />
                    <SuccessMessageDisplay successMessages={successMessages} time={50000} />
                    <Button type="submit" color="success">
                        {isRegisterFamily ? (
                            "Register Family As Admin"
                        ) : (
                            "Register As Individual"
                        )}
                    </Button>
                </Form>
            </Container>
            <div style={{ height: '20px' }}></div>
            <Label>
                {isRegisterFamily ? 'Registering as an individual to join your family?' : 'Registering a new family?'}
            </Label>
            <div style={{ height: '10px' }}></div>
            <Button onClick={toggleRegisterFamily} color="primary">
                {isRegisterFamily ? 'Register Into Existing Family' : 'Register New Family'}
            </Button>
        </Container>
    );
};

export default Register;