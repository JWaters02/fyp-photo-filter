import { Photo } from 'react-photo-album';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const handleDownload = async (photos: Photo[]) => {
    const zip = new JSZip();
    const imgFolder = zip.folder("photos")!;

    const promises = photos.map(photo => {
        return fetch(photo.src)
            .then(response => {
                if (response.status === 200) {
                    return response.blob();
                }
                return Promise.reject(new Error(response.statusText));
            })
            .then(blob => {
                if (imgFolder) {
                    const filename = photo.src.split('/').pop() + '.png' || 'default-filename.jpg';
                    imgFolder.file(filename, blob, { binary: true });
                }
            })
            .catch(error => console.error("Failed to fetch image:", error));
    });

    try {
        await Promise.all(promises);
        if (zip) {
            const content = await zip.generateAsync({ type: "blob" });
            const datetime = new Date().toISOString().replace(/T|Z|\.|:/g, '-').slice(0, -5);
            saveAs(content, `sorted_photos_${datetime}.zip`);
        }
    } catch (error) {
        console.error("Error creating zip file:", error);
    }
}