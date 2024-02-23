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


export const uploadFiles = (files: FileList, uid: string, type: string, callback: (urls: string[]) => void): void => {
    if (files.length === 0) {
        return;
    }

    if (type === 'portrait') {
        console.log(`Can't upload multiple portraits.`);
    }

    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileRef = ref(storage, `photos/${uid}/${type}/${file.name}`);
        uploadBytes(fileRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL: string) => {
                console.log('File available at', downloadURL);
                urls.push(downloadURL);
                if (urls.length === files.length) {
                    callback(urls);
                }
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    }
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

export const getFileUrlFromFileName = async (fileName: string, uid: string, type: string): Promise<string> => {
    const fileRef = ref(storage, `photos/${uid}/${type}/${fileName}`);
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