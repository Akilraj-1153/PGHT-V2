// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfTSYijd3TKY27hNbrgjDXGxRy7L0F-8Y",
  authDomain: "habit-tracking-fa9c8.firebaseapp.com",
  projectId: "habit-tracking-fa9c8",
  storageBucket: "habit-tracking-fa9c8.appspot.com",
  messagingSenderId: "1070307262026",
  appId: "1:1070307262026:web:85401d6130885ac509b0b3",
  measurementId: "G-NTTPW2KT56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider() 
const auth =getAuth(app)
const imagedb =getStorage(app)
const db = getFirestore(app)

export{app,analytics,auth,provider,imagedb,db}