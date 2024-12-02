// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCcfO0XxvFgSDEfGD_NxB4eg1DMEoUCIGE",
    authDomain: "rnauthrecipegenerator-3a104.firebaseapp.com",
    projectId: "rnauthrecipegenerator-3a104",
    storageBucket: "rnauthrecipegenerator-3a104.firebasestorage.app",
    messagingSenderId: "970337632096",
    appId: "1:970337632096:web:03ff8bb0fcb909fdfca805"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_DB = getAuth(FIREBASE_APP);

//const analytics = getAnalytics(FIREBASE_APP);