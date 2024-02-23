import { storage } from '../../firebase-config';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export const uploadPortrait = (file: File, uid: string): Promise<{ status: string; message: string; url?: string }> => {
    return new Promise((resolve, reject) => {
        const directoryRef = ref(storage, `photos/${uid}/portrait/`);

        listAll(directoryRef).then(async (result) => {
            for (const itemRef of result.items) {
                await deleteObject(itemRef);
            }

            const extension = file.name.split('.').pop();
            const filePath = `photos/${uid}/portrait/portrait.${extension}`;
            const fileRef = ref(storage, filePath);

            uploadBytes(fileRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL: string) => {
                    resolve({ status: 'success', message: 'File uploaded successfully', url: downloadURL });
                });
            }).catch((error: Error) => {
                reject({ status: 'error', message: `Error uploading file: ${error.message}` });
            });
        }).catch((error: Error) => {
            reject({ status: 'error', message: `Error listing directory: ${error.message}` });
        });
    });
};


export const uploadPhotos = (files: File[], uid: string, callback: (urls: string[]) => void): Promise<{ status: string; message: string; url?: string[] }> => {
    return new Promise((resolve, reject) => {
        if (files.length === 0) {
            reject({ status: 'warning', message: `Must upload at least one file.` });
        }

        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileRef = ref(storage, `photos/${uid}/unsorted/${file.name}`);
            uploadBytes(fileRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL: string) => {
                    urls.push(downloadURL);
                    if (urls.length === files.length) {
                        callback(urls);
                        resolve({ status: 'success', message: 'Files uploaded successfully', url: urls });
                    }
                });
            }).catch((error: Error) => {
                reject({ status: 'error', message: `Error uploading file: ${error.message}` });
            });
        }
    });
};

export const getPhotoUrls = async (uid: string, type: string): Promise<{ status: string; message: string; url?: string[]; name?: string[] }> => {
    return new Promise((resolve, reject) => {
        const photoRef = ref(storage, `photos/${uid}/${type}/`);
        listAll(photoRef).then(async (result) => {
            const urls: string[] = [];
            const names: string[] = [];
            for (const itemRef of result.items) {
                const url = await getDownloadURL(itemRef);
                urls.push(url);
                names.push(itemRef.name);
            }
            resolve({ status: 'success', message: 'Files found', url: urls, name: names });
        }).catch((error: Error) => {
            reject({ status: 'error', message: `Error listing directory: ${error.message}` });
        });
    });
};

export const getPortraitUrl = async (uid: string): Promise<string> => {
    const portraitsRef = ref(storage, `photos/${uid}/portrait/`);

    try {
        const result = await listAll(portraitsRef);
        const portraitFiles = result.items.filter(item => item.name.startsWith('portrait'));

        if (portraitFiles.length > 0) {
            const firstFile = portraitFiles[0];
            return await getDownloadURL(firstFile);
        } else {
            throw new Error('No portrait files found.');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getFileUrlFromFileName = async (fileName: string, uid: string, type: string): Promise<{ status: string; message: string; url?: string }> => {
    return new Promise((resolve, reject) => {
        const fileRef = ref(storage, `photos/${uid}/${type}/${fileName}`);
        return getDownloadURL(fileRef)
            .then((url: string) => {
                resolve({ status: 'success', message: 'File found ', url });
            })
            .catch((error: Error) => {
                reject({ status: 'error', message: `Error getting file: ${error.message}` });
            });
    });
};

export const deletePhoto = async (fileName: string, uid: string, type: string): Promise<{ status: string; message: string; }> => {
    return new Promise((resolve, reject) => {
        const fileRef = ref(storage, `photos/${uid}/${type}/${fileName}`);
        deleteObject(fileRef)
            .then(() => {
                resolve({ status: 'success', message: 'File deleted successfully' });
            })
            .catch((error: Error) => {
                reject({ status: 'error', message: `Error uploading file: ${error.message}` });
            });
    });
};