import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';
import { useDropzone } from 'react-dropzone';

const ManageAccount = (props: any) => {
    const [userDetails, setUserDetails] = useState({ familyName: "", email: "", username: "", role: "" });
    const [rules, setRules] = useState([{ id: 1, value: '' }]);

    const onDrop = useCallback((acceptedFiles: any) => {
        // Handle file(s) here. For example, you might want to update the component's state
        // with the new file, send the file to a backend server, or directly upload to cloud storage.
        console.log(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        }, onDrop
    });

    const handleAddRule = () => {
        const newId = rules.length > 0 ? rules[rules.length - 1].id + 1 : 1;
        setRules([...rules, { id: newId, value: '' }]);
    };

    const handleRemoveRule = (id: any) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    useEffect(() => {
        setUserDetails(props);
    }, [props]);

    return (
        <div className="d-flex flex-wrap justify-content-around">
            <Card className="card-container" style={{ margin: '10px' }}>
                <CardHeader className="text-center">
                    <h2>Account Settings</h2>
                </CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" placeholder="Enter first name" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" placeholder="Enter last name" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" placeholder="Enter email" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" name="username" id="username" placeholder="Enter username" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="age">Age</Label>
                            <Input type="number" name="age" id="age" placeholder="Enter age" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="sex">Sex</Label>
                            <CustomInput type="select" id="sex" name="sex">
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </CustomInput>
                        </FormGroup>
                        <FormGroup>
                            <Label for="race">Race/Ethnicity</Label>
                            <Input type="text" name="race" id="race" placeholder="Enter race/ethnicity" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="role">Role in Family</Label>
                            <Input type="text" name="role" id="role" placeholder="Enter family role" />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter className="text-center">
                    <Button color="success">Save Settings</Button>
                </CardFooter>
            </Card>

            <Card className="card-container" style={{ margin: '10px' }}>
                <CardHeader className="text-center">
                    <h2>Rules</h2>
                </CardHeader>
                <CardBody>
                    <Form>
                        {rules.map((rule, index) => (
                            <FormGroup key={rule.id}>
                                <Label for={`rule${rule.id}`}>Rule {index + 1}</Label>
                                <Input type="text" name={`rule${rule.id}`} id={`rule${rule.id}`} placeholder="Enter rule" />
                                <br />
                                <Button color="danger" onClick={() => handleRemoveRule(rule.id)}>Remove</Button>
                            </FormGroup>
                        ))}
                    </Form>
                </CardBody>
                <CardFooter className="text-center">
                    <FormGroup check>
                        <Label check>
                            <Input type="checkbox" />{' '}
                            I don't have any rules
                        </Label>
                    </FormGroup>
                    <br />
                    <Button color="primary" onClick={handleAddRule}>Add New Rule</Button>
                    <br />
                    <br />
                    <Button color="success">Save Rules</Button>
                </CardFooter>
            </Card>

            <Card className="card-container" style={{ margin: '10px' }}>
                <CardHeader className="text-center">
                    <h2>Portrait</h2>
                </CardHeader>
                <CardBody>
                    <img src="https://img.freepik.com/premium-photo/portrait-beautiful-korean-women-with-studio-background_825367-1396.jpg?w=740" alt="portrait" className="img-fluid" />
                </CardBody>
                <CardFooter className="text-center">
                    <Form>
                        <FormGroup>
                            <div {...getRootProps()} style={{ border: '2px dashed #0087F7', padding: '10px', textAlign: 'center' }}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the image here ...</p> :
                                        <><p>Drag 'n' drop your portrait here, or click to select a file</p><em>(Only *.jpg, *.jpeg and *.png images will be accepted)</em></>
                                }
                            </div>
                        </FormGroup>
                        <Button color="primary">Upload Image</Button>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ManageAccount;