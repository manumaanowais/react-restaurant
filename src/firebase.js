// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_Ufvc58SFSKrEtwZGlxP8-r3np0KnZ3Y",
  authDomain: "react-restaurant-ab97f.firebaseapp.com",
  projectId: "react-restaurant-ab97f",
  storageBucket: "react-restaurant-ab97f.appspot.com",
  messagingSenderId: "675259102718",
  appId: "1:675259102718:web:18d3ad0cdee1ea2645bcaf",
  measurementId: "G-HXC6BM003N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);