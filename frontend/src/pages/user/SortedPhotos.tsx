import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';
import { Photo } from 'react-photo-album';
import PhotoDisplay from '../../components/PhotoDisplay';
import { handleDownload } from '../../utils';

const SortedPhotos = (props: any) => {
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

    const handleDownloadPhotos = () => {
        handleDownload(photos);
    }

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Sorted Photos</h2>
                        <p>Click on a photo to open up a slideshow of it.</p>
                    </CardHeader>
                    <CardBody className="text-center">
                        <PhotoDisplay photos={photos} setPhotos={setPhotos} allowDelete={false} />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={handleDownloadPhotos} color="primary" size="lg" block>
                            Download Photos
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}



export default SortedPhotos;