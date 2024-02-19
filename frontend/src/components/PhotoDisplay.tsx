import React, { useState } from 'react';
import { Photo } from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

interface PhotoDisplayProps {
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
    photos: Photo[];
    allowDelete?: boolean;
}

const PhotoDisplay = ({ photos, setPhotos, allowDelete }: PhotoDisplayProps) => {
    const [lightboxIndex, setLightboxIndex] = useState(-1);

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