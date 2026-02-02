import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDh2SrZ0azQfANH-Rgb6y9lxtvmLF_B_Ao",
  authDomain: "jdmautoimports-b52f0.firebaseapp.com",
  projectId: "jdmautoimports-b52f0",
  storageBucket: "jdmautoimports-b52f0.firebasestorage.app",
  messagingSenderId: "866374087987",
  appId: "1:866374087987:web:8873d8336a912cc2c0fa46"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);




