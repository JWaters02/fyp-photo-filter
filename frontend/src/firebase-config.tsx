import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC2vPItGpwCs8DtJS-FGjT3xfd9z_wnAmg",
    authDomain: "photo-filter-7d89e.firebaseapp.com",
    projectId: "photo-filter-7d89e",
    storageBucket: "photo-filter-7d89e.appspot.com",
    messagingSenderId: "225267509576",
    appId: "1:225267509576:web:eb517e4aa21fc90e6b6b7d",
    measurementId: "G-312PVEJEF3",
    databaseURL: "https://photo-filter-7d89e-default-rtdb.europe-west1.firebasedatabase.app"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, firestore, database, storage, auth };