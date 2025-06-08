// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';    
import { getAuth } from 'firebase/auth';               
import { getStorage } from 'firebase/storage';   

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwXD76r5KYGLqyqVMjujBnaBJXFJo3bvE",
  authDomain: "appliance-webapp.firebaseapp.com",
  projectId: "appliance-webapp",
  storageBucket: "appliance-webapp.firebasestorage.app",
  messagingSenderId: "205236057143",
  appId: "1:205236057143:web:63c8813b01d92252913bb2",
  measurementId: "G-M28WWS4EYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
