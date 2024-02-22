import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';
import UploadBox from '../../components/UploadBox';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';
import { uploadFile, getFileUrl } from '../../utils/firebase/storage';
import { getUserInfo, setUserInfo } from '../../utils/firebase/auth';

const ManageAccount = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        age: 0,
        sex: "",
        ethnicity: "",
        familyRole: ""
    });
    const [rules, setRules] = useState([{ id: 1, value: '' }]);
    const [isRuleDisabled, setIsRuleDisabled] = useState(false);
    const [portraitSrc, setPortraitSrc] = useState('https://i.pinimg.com/550x/39/ba/08/39ba08e8aeebc95f14dc4ac04b9ca1a2.jpg');
    const [accountErrorMessages, setaccountErrorMessages] = useState<string[]>([]);
    const [accountSuccessMessages, setaccountSuccessMessages] = useState<string[]>([]);

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
            getUserInfo(uid).then((response: any) => {
                if (response.status === 'error') {
                    setaccountErrorMessages([response.message]);
                } else {
                    setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        ...response
                    }));
                }
            });
        }
    }, []);

    const handleSaveSettings = () => {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
            console.log(userDetails);
            setUserInfo(uid, userDetails.firstName, userDetails.lastName, userDetails.age, userDetails.sex, userDetails.ethnicity, userDetails.familyRole).then((response: any) => {
                if (response.status === 'error') {
                    setaccountErrorMessages([response.message]);
                } else {
                    setaccountSuccessMessages([response.message]);
                }
            });
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (file) {
            const uid = sessionStorage.getItem('uid');
            if (uid) {
                uploadFile(file, uid, "portrait", (downloadURL) => {
                    setPortraitSrc(downloadURL);
                });
            }
        }
    }, []);

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
                                <Input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="Please enter your first name"
                                    value={userDetails.firstName}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        firstName: e.target.value
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Enter last name"
                                    value={userDetails.lastName}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        lastName: e.target.value
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="age">Age</Label>
                                <Input
                                    type="number"
                                    name="age"
                                    id="age"
                                    placeholder="Enter age"
                                    value={userDetails.age.toString()}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        age: e.target.valueAsNumber
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="sex">Sex</Label>
                                <CustomInput
                                    type="select"
                                    id="sex"
                                    name="sex"
                                    value={userDetails.sex}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        sex: e.target.value
                                    }))}
                                >
                                    <option value="">Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </CustomInput>
                            </FormGroup>
                            <FormGroup>
                                <Label for="ethnicity">Ethnicity</Label>
                                <Input
                                    type="text"
                                    name="ethnicity"
                                    id="ethnicity"
                                    placeholder="Enter your ethnicity"
                                    value={userDetails.ethnicity}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        ethnicity: e.target.value
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="role">Role in Family</Label>
                                <Input
                                    type="text"
                                    name="role"
                                    id="role"
                                    placeholder="Enter family role"
                                    value={userDetails.familyRole}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        familyRole: e.target.value
                                    }))}
                                />
                            </FormGroup>
                        </Form>
                        <ErrorMessagesDisplay errorMessages={accountErrorMessages} />
                        <SuccessMessageDisplay successMessages={accountSuccessMessages} />
                    </CardBody>
                    <CardFooter className="text-center">
                        <Button onClick={handleSaveSettings} color="success">Save Settings</Button>
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
                        <UploadBox onDrop={onDrop} />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default ManageAccount;