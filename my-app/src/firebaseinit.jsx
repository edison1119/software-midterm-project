import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAG0KD8GFoj8f7z9STjotBMbuTvsi4hvBU",
    authDomain: "sf-midterm-4a5e4.firebaseapp.com",
    databaseURL: "https://sf-midterm-4a5e4-default-rtdb.firebaseio.com",
    projectId: "sf-midterm-4a5e4",
    storageBucket: "sf-midterm-4a5e4.firebasestorage.app",
    messagingSenderId: "30108469296",
    appId: "1:30108469296:web:520afd5dcdc6e44e4dc5f5",
    measurementId: "G-YD8GXHYXEH"
  };
  
  // Initialize Firebase
const app =initializeApp(firebaseConfig);
const Auth = getAuth(app);
export { Auth };