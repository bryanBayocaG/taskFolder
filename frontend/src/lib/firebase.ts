// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTK_iV-puHXzN8-Fm_aII4eYdr35m41ww",
  authDomain: "taskfolder-129f6.firebaseapp.com",
  projectId: "taskfolder-129f6",
  storageBucket: "taskfolder-129f6.firebasestorage.app",
  messagingSenderId: "927888361317",
  appId: "1:927888361317:web:6881ffa37161e7a953438c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
