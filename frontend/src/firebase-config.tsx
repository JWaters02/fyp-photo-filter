import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC2vPItGpwCs8DtJS-FGjT3xfd9z_wnAmg",
    authDomain: "photo-filter-7d89e.firebaseapp.com",
    projectId: "photo-filter-7d89e",
    storageBucket: "photo-filter-7d89e.appspot.com",
    messagingSenderId: "225267509576",
    appId: "1:225267509576:web:eb517e4aa21fc90e6b6b7d",
    measurementId: "G-312PVEJEF3"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, storage, auth as default };