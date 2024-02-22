import { storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = (file: File, callback: (url: string) => void): void => {
    const fileRef = ref(storage, `photos/${file.name}`);
    uploadBytes(fileRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL: string) => {
            console.log('File available at', downloadURL);
            callback(downloadURL);
        });
    }).catch((error: Error) => {
        console.error(error);
    });
};

export const getFileUrl = (fileName: string): Promise<string> => {
    const fileRef = ref(storage, `photos/${fileName}`);
    return getDownloadURL(fileRef)
        .then((url: string) => {
            console.log(url);
            return url;
        })
        .catch((error: Error) => {
            console.error(error);
            throw error;
        });
};