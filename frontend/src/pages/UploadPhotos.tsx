import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Photo } from 'react-photo-album';
import PhotoDisplay from '../components/PhotoDisplay';
import UploadBox from '../components/UploadBox';

const UploadPhotos = (props: any) => {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        // Mock API call to fetch photos
        const mockPhotos: Photo[] = [
            { src: "https://source.unsplash.com/8gVv6nxq6gY/1080x800", width: 1080, height: 800 },
            { src: "https://source.unsplash.com/Dhmn6ete6g8/1080x1620", width: 1080, height: 1620 },
            { src: "https://source.unsplash.com/RkBTPqPEGDo/1080x720", width: 1080, height: 720 },
        ];
        setPhotos(mockPhotos);
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPhotos: Photo[] = acceptedFiles.map(file => ({
            src: URL.createObjectURL(file),
            width: 1,
            height: 1,
            key: file.name,
        }));
        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }, []);

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Upload Photos</h2>
                    </CardHeader>
                    <CardBody className="text-center">
                        <UploadBox onDrop={onDrop} multiple />
                    </CardBody>
                </Card>
            </div>
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">My Uploaded Photos Library</h2>
                        <p>Left click on a photo to open it in a slideshow. Right click on a photo to delete it.</p>
                    </CardHeader>
                    <CardBody className="text-center">
                        <PhotoDisplay photos={photos} setPhotos={setPhotos} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default UploadPhotos;