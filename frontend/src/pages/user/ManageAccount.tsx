import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, CustomInput, CardFooter, CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import UploadBox from '../../components/UploadBox';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';
import { getPortraitUrl, uploadPortrait } from '../../utils/firebase/storage';
import { getUserInfo, setUserInfo, getFamilyMembers } from '../../utils/firebase/auth';
import { getRulesByUid, setRulesDb } from '../../utils/firebase/rules';
import { Rule, RuleType, FamilyMember } from '../../interfaces/rules';

const ManageAccount = () => {
    const [userDetails, setUserDetails] = useState({
        familyName: "",
        firstName: "",
        lastName: "",
        age: 0,
        sex: "",
        ethnicity: "",
        familyRole: "",
        bIsReadyForSort: false
    });
    const [rules, setRules] = useState<Rule[]>([]);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [portraitSrc, setPortraitSrc] = useState('https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');
    const [accountErrorMessages, setAccountErrorMessages] = useState<string[]>([]);
    const [accountSuccessMessages, setAccountSuccessMessages] = useState<string[]>([]);
    const [portraitErrorMessages, setPortraitErrorMessages] = useState<string[]>([]);
    const [portraitSuccessMessages, setPortraitSuccessMessages] = useState<string[]>([]);
    const [rulesErrorMessages, setRulesErrorMessages] = useState<string[]>([]);
    const [rulesSuccessMessages, setRulesSuccessMessages] = useState<string[]>([]);

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

            getFamilyMembers(uid).then((response: any) => {
                if (response.status === 'error') {
                    setRulesErrorMessages([response.message]);
                } else {
                    const memberList = response
                        .filter((member: any) => member.uid !== uid)
                        .map((member: any) => ({
                            uid: member.uid,
                            firstName: member.firstName,
                            lastName: member.lastName
                        }));
                    setFamilyMembers(memberList);
                }
            });

            getRulesByUid(uid).then((response: any) => {
                if (response.status === 'success' && response.message) {
                    const rulesData = response.message;
                    const ruleList: Rule[] = [];

                    Object.keys(rulesData).forEach((type) => {
                        const users = rulesData[type];

                        Object.keys(users).forEach((uid) => {
                            const user = users[uid];
                            ruleList.push({
                                id: uuidv4(),
                                type: type as RuleType,
                                uid: uid,
                                user: user
                            });
                        });
                    });

                    setRules(ruleList);
                }
            });

            getPortraitUrl(uid).then((url: string) => {
                if (url !== '') setPortraitSrc(url);
            });
        }
    }, []);

    const handleSaveSettings = () => {
        const uid = sessionStorage.getItem('uid');
        if (uid) {
            setUserInfo(uid,
                userDetails.familyName,
                userDetails.firstName,
                userDetails.lastName,
                userDetails.age,
                userDetails.sex,
                userDetails.ethnicity,
                userDetails.familyRole,
                userDetails.bIsReadyForSort
            ).then((response: any) => {
                if (response.status === 'error') {
                    setAccountErrorMessages([response.message]);
                } else {
                    setAccountSuccessMessages([response.message]);
                }
            });
        }
    };

    const handleSaveRules = () => {
        for (const rule of rules) {
            if (rule.user === '') {
                setRulesErrorMessages(['Please fill in all rule values.']);
                return;
            }
        }

        const uid = sessionStorage.getItem('uid');
        if (uid) {
            setRulesDb(uid, rules).then((response: any) => {
                if (response.status === 'error') {
                    setRulesErrorMessages([response.message]);
                } else {
                    setRulesSuccessMessages([`Rules updated successfully for ${userDetails.firstName} ${userDetails.lastName}.`]);
                }
            });
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (file) {
            const uid = sessionStorage.getItem('uid');
            if (uid) {
                uploadPortrait(file, uid).then((response: any) => {
                    if (response.status === 'error') {
                        setPortraitErrorMessages([response.message]);
                    } else {
                        setPortraitSuccessMessages([response.message]);
                        setPortraitSrc(response.url);
                    }
                });
            }
        } else {
            setPortraitErrorMessages(['Please upload one valid image file.']);
        }
    }, []);

    const handleAddRule = (type: RuleType) => {
        const newRule = { id: uuidv4(), type: type, uid: '', user: '' };
        setRules([...rules, newRule]);
    };

    const handleRemoveRule = (id: string) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const handleRuleValueChange = (e: React.ChangeEvent<HTMLInputElement>, ruleId: string) => {
        const selectedMemberUid = e.target.value;
        const selectedMember = familyMembers.find(member => member.uid === selectedMemberUid);
    
        setRules(rules.map(rule => {
            if (rule.id === ruleId) {
                return { 
                    ...rule, 
                    uid: selectedMemberUid,
                    user: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : ''
                };
            }
            return rule;
        }));
    };

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const renderRuleInput = (rule: Rule) => {
        let label = "";
        switch (rule.type) {
            case 'hideAllPhotosUploadedByMeFrom':
                label = "Hide my photos from:";
                break;
            case 'hideMyPhotosContainingMeFrom':
                label = "Hide photos containing me from:";
                break;
            case 'hideMyPhotosContainingNonFamilyMembersFrom':
                label = "Hide my photos containing non-family members from:";
                break;
            default:
                return null;
        }
        return (
            <div>
                <Label>{label}</Label>
                <CustomInput
                    type="select"
                    name={`rule${rule.id}`}
                    id={`rule${rule.id}`}
                    value={rule.uid}
                    onChange={(e) => handleRuleValueChange(e, rule.id)}
                    style={{ flex: 1 }}
                >
                    <option value="">Select Family Member</option>
                    {familyMembers.map(member => (
                        <option key={member.uid} value={member.uid}>{`${member.firstName} ${member.lastName}`}</option>
                    ))}
                </CustomInput>
            </div>
        );
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
                                <Label for="readyForSort">I've set my user details, rules (if any), uploaded my portrait and photos, and I am ready for them to be sorted to the rest of the family.</Label>
                                <CustomInput
                                    type="checkbox"
                                    id="readyForSort"
                                    name="readyForSort"
                                    checked={userDetails.bIsReadyForSort}
                                    onChange={(e) => setUserDetails(prevDetails => ({
                                        ...prevDetails,
                                        bIsReadyForSort: e.target.checked
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
                        <p>These are rules that you set in order for the system to filter through the photos.</p>
                    </CardHeader>
                    <CardBody>
                        {rules.length === 0 ? (
                            <p>No rules set.</p>
                        ) : (
                            <Form>
                                {rules.map((rule, index) => (
                                    <FormGroup key={rule.id}>
                                        <Label for={`rule${rule.id}`}><strong>Rule {index + 1}</strong></Label>
                                        {renderRuleInput(rule)}
                                        <br />
                                        <Button
                                            color="danger"
                                            onClick={() => handleRemoveRule(rule.id)}
                                        >
                                            Remove rule {index + 1}
                                        </Button>
                                    </FormGroup>
                                ))}
                            </Form>
                        )}
                    </CardBody>
                    <CardFooter className="text-center">
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction='down'>
                            <DropdownToggle caret color="primary">
                                Add New Rule
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Rule types</DropdownItem>
                                <DropdownItem onClick={() => handleAddRule('hideAllPhotosUploadedByMeFrom')}>Hide my photos from</DropdownItem>
                                <DropdownItem onClick={() => handleAddRule('hideMyPhotosContainingMeFrom')}>Hide photos containing me from</DropdownItem>
                                <DropdownItem onClick={() => handleAddRule('hideMyPhotosContainingNonFamilyMembersFrom')}>Hide my photos containing non-family members from</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <br />
                        <Button onClick={handleSaveRules} color="success">Save Rules</Button>
                        <br />
                        <br />
                        <ErrorMessagesDisplay errorMessages={rulesErrorMessages} />
                        <SuccessMessageDisplay successMessages={rulesSuccessMessages} />
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
                        <UploadBox onDrop={onDrop} multiple={false} text={"Drag 'n' drop your portrait here, or click to select a file"} />
                        <br />
                        <ErrorMessagesDisplay errorMessages={portraitErrorMessages} />
                        <SuccessMessageDisplay successMessages={portraitSuccessMessages} />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default ManageAccount;