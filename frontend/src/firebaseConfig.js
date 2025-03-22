// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjJjroxUyF6Fcw-tQeGdArcTCzLEWuWFs",
  authDomain: "hack-3fdf5.firebaseapp.com",
  projectId: "hack-3fdf5",
  storageBucket: "hack-3fdf5.firebasestorage.app",
  messagingSenderId: "192820242474",
  appId: "1:192820242474:web:0dc01c1e4421edf8b2bb53",
  measurementId: "G-0Y1RPPLC6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
