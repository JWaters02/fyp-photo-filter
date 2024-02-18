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

    const toggleSelection = (src: string) => {
        const newSelection = new Set(selectedPhotos);
        if (newSelection.has(src)) {
            newSelection.delete(src);
        } else {
            newSelection.add(src);
        }
        setSelectedPhotos(newSelection);
    };

    const deleteSelectedPhotos = () => {
        const remainingPhotos = photos.filter(photo => !selectedPhotos.has(photo.src));
        setPhotos(remainingPhotos);
        setSelectedPhotos(new Set());
    };

    const renderPhoto = ({
        photo,
        imageProps,
        wrapperStyle
    }: RenderPhotoProps): JSX.Element => {
        const isSelected = selectedPhotos.has(photo.src);

        return (
            <div
                style={{ ...wrapperStyle, outline: isSelected ? '2px solid blue' : 'none'}}
                onClick={() => toggleSelection(photo.src)}
            >
                <img {...imageProps} alt={photo.alt || `Photo ${photo.src}`} />
            </div>
        );
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
                    </CardHeader>
                    <CardBody className="text-center">
                        <Button color="danger" onClick={deleteSelectedPhotos} style={{ marginBottom: '10px' }}>
                            Delete Selected
                        </Button>
                        <PhotoAlbum
                            photos={photos}
                            layout="rows"
                            targetRowHeight={150}
                            onClick={({ index }) => setLightboxIndex(index)}
                            renderPhoto={renderPhoto}
                        />
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