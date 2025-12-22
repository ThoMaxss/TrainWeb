// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdmOqDFEfQ1MFSaLEFqjsS9GexF_BBYFM",
  authDomain: "gorail-g16.firebaseapp.com",
  projectId: "gorail-g16",
  storageBucket: "gorail-g16.firebasestorage.app",
  messagingSenderId: "990081188688",
  appId: "1:990081188688:web:484b3b0144852d0c5ce255",
  measurementId: "G-YPQQBLZKDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);