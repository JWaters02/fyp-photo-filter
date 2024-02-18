import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, FormText, CustomInput, CardFooter, CardHeader } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import { PhotoAlbum, Photo, RenderPhotoProps } from 'react-photo-album';

const UploadPhotos = (props: any) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

    useEffect(() => {
        // Mock getting photos from the API
        const mockPhotos: Photo[] = [
            {
                src: 'https://img.freepik.com/premium-photo/portrait-beautiful-korean-women-with-studio-background_825367-1396.jpg',
                width: 740,
                height: 500,
                key: 'unique-key-1'
            },
            {
                src: 'https://img.freepik.com/premium-photo/portrait-beautiful-korean-women-with-studio-background_825367-1396.jpg',
                width: 740,
                height: 500,
                key: 'unique-key-1'
            },
            {
                src: 'https://img.freepik.com/premium-photo/portrait-beautiful-korean-women-with-studio-background_825367-1396.jpg',
                width: 740,
                height: 500,
                key: 'unique-key-1'
            },
        ];
        setPhotos(mockPhotos);
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Map over acceptedFiles and cast each file to the Photo type
        const newPhotos: Photo[] = acceptedFiles.map(file => ({
            src: URL.createObjectURL(file),
            width: 1, // Use image metadata to determine the actual width
            height: 1, // Use image metadata to determine the actual height
            key: file.name, // Use a unique identifier for the key
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

    const toggleSelection = (index: number) => {
        const selected = selectedPhotos.includes(index);
        const newSelectedPhotos = selected ? selectedPhotos.filter(i => i !== index) : [...selectedPhotos, index];
        setSelectedPhotos(newSelectedPhotos);
    };

    const deleteSelectedPhotos = () => {
        setPhotos(currentPhotos => currentPhotos.filter((_, index) => !selectedPhotos.includes(index)));
        setSelectedPhotos([]);
    };

    const renderPhoto = ({
        photo,
        layout,
        layoutOptions,
        imageProps,
        renderDefaultPhoto,
        wrapperStyle
    }: RenderPhotoProps): JSX.Element => {
        return (
            <div style={wrapperStyle}>
                <img
                    {...imageProps}
                    onClick={() => console.log(`Photo ${photo.src} clicked`)}
                    alt={photo.alt || `Photo ${photo.key}`}
                />
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
                        <PhotoAlbum
                            layout="rows"
                            photos={photos}
                            renderPhoto={renderPhoto}
                        />
                        <CardFooter>
                            <Button color="danger" onClick={deleteSelectedPhotos}>Delete Selected</Button>
                        </CardFooter>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default UploadPhotos;