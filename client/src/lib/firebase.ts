import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMdH8eoSXk9M8icxWB7cd3neS84faMbr0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cars-4ecea.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cars-4ecea",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cars-4ecea.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "254741947742",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:254741947742:web:9cc7ec263ed8a8687c1bcf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);




