import { PhotoProps } from '../interfaces/PhotoProps';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const handleDownload = async (photos: PhotoProps[]) => {
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
                    if (photo.name) {
                        imgFolder.file(photo.name, blob, { binary: true });
                    }
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