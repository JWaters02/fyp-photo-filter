import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';
import { PhotoProps } from '../../interfaces/photo-props';
import PhotoDisplay from '../../components/PhotoDisplay';
import { getPhotoUrls } from '../../utils/firebase/storage';
import { handleDownload } from '../../utils/download';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';

const SortedPhotos = (props: any) => {
    const [photos, setPhotos] = useState<PhotoProps[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [successMessages, setSuccessMessages] = useState<string[]>([]);

    const getUnsortedPhotos = useCallback(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) {
            setErrorMessages(['User ID not found.']);
            return;
        }

        setPhotos([]);

        getPhotoUrls(uid, 'sorted').then(response => {
            if (response.status === 'success') {
                const newPhotos: PhotoProps[] = response.url?.map((url, index) => ({
                    name: response.name?.[index],
                    src: url,
                    width: 1,
                    height: 1,
                    key: `${url}-${index}`,
                })) || [];
                setPhotos(newPhotos);
            } else {
                setErrorMessages([response.message]);
            }
        });
    }, []);

    useEffect(() => {
        getUnsortedPhotos();
    }, [getUnsortedPhotos]);

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
                        <ErrorMessagesDisplay errorMessages={errorMessages} />
                        <SuccessMessageDisplay successMessages={successMessages} />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}



export default SortedPhotos;