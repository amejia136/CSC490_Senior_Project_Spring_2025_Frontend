
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAhHipRfqvK1vgpBBL6iAGUXzfKLA79rFY",
    authDomain: "journeyhub-7bad8.firebaseapp.com",
    projectId: "journeyhub-7bad8",
    storageBucket: "journeyhub-7bad8.firebasestorage.app",
    messagingSenderId: "834192142060",
    appId: "1:834192142060:web:3fd37ca7bafdb5f96b7fc9",
    measurementId: "G-Q07ZJGGJ9C"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { app, auth };