import React from 'react';
import { Form, FormGroup } from 'reactstrap';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

interface CustomDropzoneProps {
    onDrop: DropzoneOptions['onDrop'];
    multiple?: boolean;
    text: string;
}

const CustomDropzone: React.FC<CustomDropzoneProps> = ({ onDrop, multiple = false, text = "" }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        },
        onDrop,
        multiple
    });

    return (
        <Form>
            <FormGroup>
                <div {...getRootProps()} style={{ border: '2px dashed #0087F7', padding: '10px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image here ...</p>
                    ) : (
                        <>
                            <p>{text}</p>
                            <em>(Only *.jpg, *.jpeg and *.png images will be accepted)</em>
                        </>
                    )}
                </div>
            </FormGroup>
        </Form>
    );
};

export default CustomDropzone;