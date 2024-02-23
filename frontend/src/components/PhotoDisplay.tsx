import React, { useState } from 'react';
import { PhotoProps } from '../interfaces/PhotoProps';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { deletePhoto } from '../utils/firebase/storage';

interface PhotoDisplayProps {
    setPhotos: React.Dispatch<React.SetStateAction<PhotoProps[]>>;
    photos: PhotoProps[];
    allowDelete?: boolean;
    showTooltips?: boolean;
}

const PhotoDisplay = ({ photos, setPhotos, allowDelete, showTooltips }: PhotoDisplayProps) => {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const handlePhotoClick = (event: React.MouseEvent, photo: PhotoProps, index: number) => {
        if (event.type === 'click') {
            setLightboxIndex(index);
        }
    };

    const handlePhotoContextMenu = (event: React.MouseEvent, photo: PhotoProps, index: number) => {
        event.preventDefault();
        setPhotos(currentPhotos => currentPhotos.filter((_, i) => i !== index));

        const uid = sessionStorage.getItem('uid');
        if (!uid) {
            console.error('User ID not found.');
            return;
        }

        if (!photo.name) {
            console.error('Photo name not found.');
            return;
        }

        deletePhoto(photo.name, uid, 'unsorted').then(response => {
            if (response.status === 'error') {
                console.error(response.message);
            }
        });
    };

    return (
        <>
            <div className="photo-album">
                {photos.map((photo, index) => (
                    <div
                        key={photo.src}
                        onClick={(event) => handlePhotoClick(event, photo, index)}
                        {...(allowDelete ? { onContextMenu: (event) => handlePhotoContextMenu(event, photo, index) } : {})}
                    >
                        <img src={photo.src} alt={photo.title || 'Photo'} width="100%" />
                    </div>
                ))}
            </div>
            <Lightbox
                slides={photos.map(photo => ({ src: photo.src }))}
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]} />
        </>
    );
};

export default PhotoDisplay;