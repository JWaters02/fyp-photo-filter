import { storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = (file: File, uid: string, type: string, callback: (url: string) => void): void => {
    const location = {
        portrait: 'portrait',
        unsorted: 'unsorted',
        sorted: 'sorted'
    }[type];
    const fileRef = ref(storage, `photos/${uid}/${location}/${file.name}`);
    uploadBytes(fileRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL: string) => {
            console.log('File available at', downloadURL);
            callback(downloadURL);
        });
    }).catch((error: Error) => {
        console.error(error);
    });
};

export const getFileUrl = (fileName: string, uid: string, type: string): Promise<string> => {
    const location = {
        portrait: 'portrait',
        unsorted: 'unsorted',
        sorted: 'sorted'
    }[type];
    const fileRef = ref(storage, `photos/${uid}/${location}/${fileName}`);
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