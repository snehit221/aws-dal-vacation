// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvrcePVdawbDkVT-e86fMOKjhrUvU4MxU",
  authDomain: "serverless-fe747.firebaseapp.com",
  projectId: "serverless-fe747",
  storageBucket: "serverless-fe747.appspot.com",
  messagingSenderId: "961684596617",
  appId: "1:961684596617:web:ae945358c466d9695ea358",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
