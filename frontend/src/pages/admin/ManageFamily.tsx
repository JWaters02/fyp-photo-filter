import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Form, FormGroup, Label, Input, CardFooter, CardHeader, CustomInput } from 'reactstrap';
import { ErrorMessagesDisplay, WarningMessageDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';
import { getUserInfo, setAdminInfo, getIsReadyForSort } from '../../utils/firebase/auth';
import { postSort } from "../../utils/api";

const ManageFamily = (props: any) => {
    const [userDetails, setUserDetails] = useState({ familyName: "", bIsReadyForSort: false});
    const [isReadyForSort, setIsReadyForSort] = useState(false);
    const [accountErrorMessages, setAccountErrorMessages] = useState<string[]>([]);
    const [accountWarningMessages, setAccountWarningMessages] = useState<string[]>([]);
    const [accountSuccessMessages, setAccountSuccessMessages] = useState<string[]>([]);

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
            getUserInfo(uid).then((response: any) => {
                if (response.status === 'error') {
                    setAccountErrorMessages([response.message]);
                } else {
                    setUserDetails((prevDetails) => ({
                        ...prevDetails,
                        ...response
                    }));
                }
            });

            getIsReadyForSort(uid).then((response: any) => {
                if (response.status === 'error') {
                    setAccountErrorMessages([response.message]);
                    setIsReadyForSort(false);
                } else if (response.status === 'warning') {
                    setAccountWarningMessages([response.message]);
                    setIsReadyForSort(false);
                } else {
                    setAccountSuccessMessages([response.message]);
                    setIsReadyForSort(true);
                }
            });
        }
    }, []);

    const handleOnSort = () => {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
            setAdminInfo(uid, userDetails.familyName, userDetails.bIsReadyForSort).then((response: any) => {
                if (response.status === 'error') {
                    setAccountErrorMessages([response.message]);
                } else {
                    setAccountSuccessMessages([response.message]);
                }
            });

            postSort(uid, userDetails.familyName).then((response: any) => {
                if (response.status === 'error') {
                    setAccountErrorMessages([response.message]);
                } else {
                    setAccountSuccessMessages([response.data]);
                }
            });
        }
    }

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
                                <Input 
                                    type="text" 
                                    name="familyName" 
                                    id="familyName" 
                                    disabled={true} 
                                    placeholder={userDetails.familyName} 
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="readyForSort">All family members are ready for their photos to be sorted (this checkbox will enable when all family members have said they are ready).</Label>
                                <CustomInput
                                    type="checkbox"
                                    id="readyForSort"
                                    name="readyForSort"
                                    disabled={!isReadyForSort}
                                    checked={userDetails.bIsReadyForSort}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        bIsReadyForSort: e.target.checked
                                    }))}
                                />
                            </FormGroup>
                            <FormGroup>
                                
                            </FormGroup>
                        </Form>
                    </CardBody>
                    <CardFooter className="text-center">
                        <Button onClick={handleOnSort} disabled={!isReadyForSort} color="success">Sort Photos</Button>
                        <div style={{ height: '20px' }}></div>
                        <ErrorMessagesDisplay errorMessages={accountErrorMessages} />
                        <WarningMessageDisplay warningMessages={accountWarningMessages} />
                        <SuccessMessageDisplay successMessages={accountSuccessMessages} />
                        <Button 
                            color="danger"
                            onClick={() => {
                                alert("This feature is not yet implemented. Please contact the site administrator to have all photos deleted.");
                            }}
                        >
                            Delete All Photos
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ManageFamily;