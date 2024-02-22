import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';
import { Photo } from 'react-photo-album';
import { handleDownload } from '../../utils/download';
import { FaCheckCircle } from 'react-icons/fa';

const UnsortedPhotos = (props: any) => {
    const [familyMembers, setFamilyMembers] = useState<{ [key: string]: Photo[] }>({});
    const [selectedPhotosPerFamilyMember, setSelectedPhotosPerFamilyMember] = useState<{ [key: string]: Photo[] }>({});
    const [selectedPhotos, setSelectedPhotos] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Mock API call to fetch family members and their photos
        const mockFamilyMembers = {
            "John Doe": [
                { src: "https://source.unsplash.com/RkBTPqPEGDo/1080x720", width: 1080, height: 720 },
            ],
            "Jane Doe": [
                { src: "https://source.unsplash.com/8gVv6nxq6gY/1080x800", width: 1080, height: 800 },
                { src: "https://source.unsplash.com/Dhmn6ete6g8/1080x1620", width: 1080, height: 1620 },
                { src: "https://source.unsplash.com/LBI7cgq3pbM/1080x800", width: 1080, height: 800 },
            ],
        };
        setFamilyMembers(mockFamilyMembers);
    }, []);

    const handleDownloadPhotos = () => {
        const allPhotos = Object.values(familyMembers).reduce((acc, photos) => acc.concat(photos), [] as Photo[]);
        handleDownload(allPhotos);
    }

    const handlePhotoClick = (event: React.MouseEvent, photo: Photo, memberName: string, photoIndex: number) => {
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
                        <h2 className="text-center">Unsorted Photos</h2>
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
}

export default UnsortedPhotos;