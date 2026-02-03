import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
// Customers must create a .env file with these values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config
export const isFirebaseInitialized = !!firebaseConfig.apiKey;

let app;
let dbInstance;

if (isFirebaseInitialized) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
} else {
  console.warn("Firebase credentials missing. App will run in Setup Mode.");
}

// Export casted db to avoid TypeScript errors in consumers
// The App component will prevent usage if !isFirebaseInitialized
export const db = dbInstance as ReturnType<typeof getFirestore>;




