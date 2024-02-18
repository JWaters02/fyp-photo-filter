import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';
import { useDropzone } from 'react-dropzone';

const ManageAccount = (props: any) => {
    const [userDetails, setUserDetails] = useState({ familyName: "", email: "", username: "", role: "" });
    const [rules, setRules] = useState([{ id: 1, value: '' }]);
    const [isRuleDisabled, setIsRuleDisabled] = useState(false);
    const [portraitSrc, setPortraitSrc] = useState('https://img.freepik.com/premium-photo/portrait-beautiful-korean-women-with-studio-background_825367-1396.jpg?w=740');

    useEffect(() => {
        setUserDetails(props);
    }, [props]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setPortraitSrc(reader.result as string);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }, []);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        onDrop,
        multiple: false
    });

    const handleAddRule = () => {
        const newId = rules.length > 0 ? rules[rules.length - 1].id + 1 : 1;
        setRules([...rules, { id: newId, value: '' }]);
    };

    const handleRemoveRule = (id: any) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const toggleRulesDisable = () => {
        setIsRuleDisabled(!isRuleDisabled);
    };

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
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

                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Rules</h2>
                        <p>These are rules that you set in order for the system to filter through the photos. For example, a rule could be "I don't want John Smith to see any photos including me".</p>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            {rules.map((rule, index) => (
                                <FormGroup key={rule.id}>
                                    <Label for={`rule${rule.id}`}>Rule {index + 1}</Label>
                                    <Input
                                        type="text"
                                        name={`rule${rule.id}`}
                                        id={`rule${rule.id}`}
                                        placeholder="Enter rule"
                                        disabled={isRuleDisabled}
                                    />
                                    <br />
                                    <Button
                                        color="danger"
                                        onClick={() => handleRemoveRule(rule.id)}
                                        disabled={isRuleDisabled}
                                    >
                                        Remove
                                    </Button>
                                </FormGroup>
                            ))}
                        </Form>
                    </CardBody>
                    <CardFooter className="text-center">
                        <Button color="primary" onClick={handleAddRule} disabled={isRuleDisabled}>Add New Rule</Button>
                        <br />
                        <br />
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" onChange={toggleRulesDisable} checked={isRuleDisabled} />{' '}
                                I don't have any rules
                            </Label>
                        </FormGroup>
                        <br />
                        <Button color="success">Save Rules</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Portrait</h2>
                        <p>Please try to take your portrait facing straight on with good lighting. Don't wear sunglasses or anything that covers your face.</p>
                    </CardHeader>
                    <CardBody>
                        <img src={portraitSrc} alt="portrait" className="img-fluid" />
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
        </div>
    );
}

export default ManageAccount;