import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { PhotoAlbum, Photo, RenderPhotoProps } from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const UploadPhotos = (props: any) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
    const [lightboxIndex, setLightboxIndex] = useState(-1);

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        onDrop,
        multiple: true
    });

    const handlePhotoClick = (event: React.MouseEvent, photo: Photo, index: number) => {
        if (event.type === 'click') {
            setLightboxIndex(index);
        }
    };

    const handlePhotoContextMenu = (event: React.MouseEvent, photo: Photo, index: number) => {
        event.preventDefault();
        setPhotos(currentPhotos => currentPhotos.filter((_, i) => i !== index));
    };

    return (
        <div className="container">
            <div className="row">
                <Card className="card-container col-12" style={{ margin: '10px' }}>
                    <CardHeader>
                        <h2 className="text-center">Upload Photos</h2>
                    </CardHeader>
                    <CardBody className="text-center">
                        <Form>
                            <FormGroup>
                                <div {...getRootProps()} style={{ border: '2px dashed #0087F7', padding: '10px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p>Drop the image here ...</p> :
                                            <><p>Drag 'n' drop your portrait here, or click to select a file</p><em>(Only *.jpg, *.jpeg and *.png images will be accepted)</em></>
                                    }
                                </div>
                            </FormGroup>
                        </Form>
                        <Button color="primary">Upload Image</Button>
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
                        <div className="photo-album">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.src}
                                    onClick={(event) => handlePhotoClick(event, photo, index)}
                                    onContextMenu={(event) => handlePhotoContextMenu(event, photo, index)}
                                >
                                    <img src={photo.src} alt={photo.title || 'Photo'} width="100%"/>
                                </div>
                            ))}
                        </div>
                        <Lightbox
                            slides={photos.map(photo => ({ src: photo.src }))}
                            open={lightboxIndex >= 0}
                            index={lightboxIndex}
                            close={() => setLightboxIndex(-1)}
                            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default UploadPhotos;