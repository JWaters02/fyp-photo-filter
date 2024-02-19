import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';

const ManageFamily = (props: any) => {
    const [userDetails, setUserDetails] = useState({ familyName: "", email: "", username: "", role: "" });

    useEffect(() => {
        setUserDetails(props);
    }, [props]);

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader className="text-center">
                        <h2>Family Account Settings</h2>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <FormGroup>
                                <Label for="familyName">Family Name</Label>
                                <Input type="text" name="familyName" id="familyName" placeholder={userDetails.familyName} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" placeholder={userDetails.username} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" id="email" placeholder={userDetails.email} />
                            </FormGroup>
                        </Form>
                    </CardBody>
                    <CardFooter className="text-center">
                        <Button color="success">Save Settings</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ManageFamily;