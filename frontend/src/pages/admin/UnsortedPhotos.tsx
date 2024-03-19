import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button, CustomInput } from 'reactstrap';
import { PhotoProps } from '../../interfaces/photo-props';
import { handleDownload } from '../../utils/download';
import { FaCheckCircle } from 'react-icons/fa';
import { getFamilyMembers } from '../../utils/firebase/auth';
import { getPhotoUrls } from '../../utils/firebase/storage';
import { FamilyMember } from '../../interfaces/rules';

const UnsortedPhotos = (props: any) => {
    const [familyMembers, setFamilyMembers] = useState<{ [key: string]: PhotoProps[] }>({});
    const [selectedPhotosPerFamilyMember, setSelectedPhotosPerFamilyMember] = useState<{ [key: string]: PhotoProps[] }>({});
    const [familyMemberNames, setFamilyMemberNames] = useState<FamilyMember[]>([]);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) {
            console.error('User ID not found.');
            return;
        }
        getFamilyMembers(uid).then((response: any) => {
            if (response.status === 'error') {
                console.error(response.message);
            } else {
                // For family name selection
                const memberList = response
                    .filter((member: any) => member.uid !== uid)
                    .map((member: any) => ({
                        uid: member.uid,
                        firstName: member.firstName,
                        lastName: member.lastName
                    }));
                    setFamilyMemberNames(memberList);

                // For photo selection
                const familyMembers: { [key: string]: PhotoProps[] } = {};
                response.forEach((member: any) => {
                    getPhotoUrls(member.uid, 'unsorted').then((response: any) => {
                        if (response.status === 'error') {
                            console.error(response.message);
                        } else {
                            familyMembers[`${member.firstName} ${member.lastName}`] = response.url?.map((url: string, index: number) => ({
                                name: response.name?.[index],
                                src: url,
                                width: 1,
                                height: 1,
                                key: `${url}-${index}`,
                            })) || [];
                            setFamilyMembers(familyMembers);
                        }
                    });
                });
            }
        });
    }, []);

    const handleDownloadPhotos = () => {
        const allPhotos = Object.values(familyMembers).reduce((acc, photos) => acc.concat(photos), [] as PhotoProps[]);
        handleDownload(allPhotos);
    }

    const handlePhotoClick = (event: React.MouseEvent, photo: PhotoProps, memberName: string, photoIndex: number) => {
        const photoKey = `${memberName}-${photoIndex}`;
        setSelectedPhotos(prevState => ({
            ...prevState,
            [photoKey]: !prevState[photoKey],
        }));
    };

    const handleFamilyMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedMemberUid = e.target.value;
        const selectedMember = familyMemberNames.find(member => member.uid === selectedMemberUid);
    
        if (selectedMember) {
            const selectedPhotos = familyMembers[`${selectedMember.firstName} ${selectedMember.lastName}`];
            setSelectedPhotosPerFamilyMember(prevState => ({
                ...prevState,
                [`${selectedMember.firstName} ${selectedMember.lastName}`]: selectedPhotos,
            }));

            setSelectedFamilyMember(selectedMember);
        }
    };

    const handleSendPhotoToFamilyMember = () => {
        let selectedPhotos: PhotoProps[];

        if (!selectedFamilyMember) {
            console.error('No family member selected.');
            return;
        }

        selectedPhotos = Object.entries(selectedPhotosPerFamilyMember)
            .filter(([photoKey, isSelected]) => isSelected)
            .map(([photoKey]) => photoKey.split('-')[1])
            .map(photoIndex => selectedPhotosPerFamilyMember[`${selectedFamilyMember.firstName} ${selectedFamilyMember.lastName}`][Number(photoIndex)]);

        console.log('selectedPhotos', selectedPhotos);
    }

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Unsorted Photos</h2>
                        <p>Click on a photo to select it for manual sorting. Once you have made a selection, select a family member to send it to.</p>
                        <CustomInput
                            type="select"
                            name="selectFamilyMember"
                            id="selectFamilyMember"
                            value={selectedFamilyMember?.uid || ''}
                            onChange={(e) => handleFamilyMemberChange(e)}
                            style={{ flex: 1 }}
                        >
                            <option value="">Select Family Member</option>
                            {familyMemberNames.map(member => (
                                <option key={member.uid} value={member.uid}>{`${member.firstName} ${member.lastName}`}</option>
                            ))}
                        </CustomInput>
                        <div style={{ height: '20px' }}></div>
                        <Button onClick={handleSendPhotoToFamilyMember} color="success">
                            Send Selected Photos
                        </Button>
                    </CardHeader>
                    <CardBody className="text-center">
                        {Object.entries(familyMembers).map(([memberName, photos], memberIndex) => (
                            <div key={memberName}>
                                {memberIndex > 0 && <hr />}
                                <h3>{memberName}</h3>
                                {memberIndex > 0 && <hr />}
                                <div className="photo-album">
                                    {photos.map((photo, index) => {
                                        const photoKey = `${memberName}-${index}`;
                                        return (
                                            <div
                                                key={photo.src}
                                                onClick={(event) => handlePhotoClick(event, photo, memberName, index)}
                                                style={{ position: 'relative', display: 'inline-block' }}
                                            >
                                                <img src={photo.src} alt={photo.title || 'Photo'} width="100%" />
                                                {selectedPhotos[photoKey] && (
                                                    <FaCheckCircle
                                                        style={{ position: 'absolute', top: '10px', right: '10px', color: 'green', fontSize: '30px' }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardBody>
                    <CardFooter className='text-center'>
                        <Button onClick={handleDownloadPhotos} color="success">
                            Download All Photos
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default UnsortedPhotos;