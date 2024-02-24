import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';
import { PhotoProps } from '../../interfaces/photo-props';
import { handleDownload } from '../../utils/download';
import { FaCheckCircle } from 'react-icons/fa';
import { getFamilyMembers } from '../../utils/firebase/auth';
import { getPhotoUrls } from '../../utils/firebase/storage';

const UnsortedPhotos = (props: any) => {
    const [familyMembers, setFamilyMembers] = useState<{ [key: string]: PhotoProps[] }>({});
    const [selectedPhotosPerFamilyMember, setSelectedPhotosPerFamilyMember] = useState<{ [key: string]: PhotoProps[] }>({});
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

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Unsortable Photos</h2>
                        <p>Click on a photo to select it for manual sorting.</p>
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