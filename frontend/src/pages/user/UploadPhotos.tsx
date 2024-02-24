import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { PhotoProps } from '../../interfaces/photo-props';
import PhotoDisplay from '../../components/PhotoDisplay';
import UploadBox from '../../components/UploadBox';
import { getPhotoUrls, uploadPhotos } from '../../utils/firebase/storage';
import { ErrorMessagesDisplay, SuccessMessageDisplay } from '../../components/AlertDisplays';

const UploadPhotos = (props: any) => {
    const [photos, setPhotos] = useState<PhotoProps[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [successMessages, setSuccessMessages] = useState<string[]>([]);

    const getuploadedPhotos = useCallback(() => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) {
            setErrorMessages(['User ID not found.']);
            return;
        }

        setPhotos([]);

        getPhotoUrls(uid, 'uploaded').then(response => {
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
        getuploadedPhotos();
    }, [getuploadedPhotos]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uid = sessionStorage.getItem('uid');
        if (!uid) {
            setErrorMessages(['User ID not found.']);
            return;
        }
        uploadPhotos(acceptedFiles, uid, (urls: string[]) => {
            setPhotos(currentPhotos => currentPhotos.concat(urls.map((url, index) => ({
                name: acceptedFiles[index].name,
                src: url,
                width: 1,
                height: 1,
                key: `${url}-${index}`,
            }))));
            setSuccessMessages([`Uploaded ${urls.length} files.`]);
        }).then(response => {
            if (response.status === 'error') {
                setErrorMessages([response.message]);
            }
        });
    }, []);

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Upload New Photos</h2>
                    </CardHeader>
                    <CardBody className="text-center">
                        <UploadBox onDrop={onDrop} multiple />
                    </CardBody>
                    <CardFooter>
                        <ErrorMessagesDisplay errorMessages={errorMessages} />
                        <SuccessMessageDisplay successMessages={successMessages} />
                    </CardFooter>
                </Card>
            </div>
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Uploaded Photos Library</h2>
                        <p>Left click on a photo to open it in a slideshow. Right click on a photo to delete it.</p>
                    </CardHeader>
                    <CardBody className="text-center">
                        <PhotoDisplay photos={photos} setPhotos={setPhotos} allowDelete={true} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default UploadPhotos;