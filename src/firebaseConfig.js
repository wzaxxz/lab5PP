import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWPudlAt3lGE9ZoQt0lrNtVAVAV5g9b0o",
  authDomain: "bookingapp-7fbee.firebaseapp.com",
  projectId: "bookingapp-7fbee",
  storageBucket: "bookingapp-7fbee.firebasestorage.app",
  messagingSenderId: "885931185323",
  appId: "1:885931185323:web:c1ab13ffd994342ba413ee",
  measurementId: "G-VZJBD31X45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };