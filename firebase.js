// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3s1YmfkDbF5kOOyLWyvjbWkrSY7JyKbw",
  authDomain: "inventory-management-d2d84.firebaseapp.com",
  projectId: "inventory-management-d2d84",
  storageBucket: "inventory-management-d2d84.appspot.com",
  messagingSenderId: "603234323227",
  appId: "1:603234323227:web:e21a971e1a1a08a028e1be",
  measurementId: "G-J69G29TW3H"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}