
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

// Firebase client config – same as in client/src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyCMdH8eoSXk9M8icxWB7cd3neS84faMbr0",
  authDomain: "cars-4ecea.firebaseapp.com",
  projectId: "cars-4ecea",
  storageBucket: "cars-4ecea.firebasestorage.app",
  messagingSenderId: "254741947742",
  appId: "1:254741947742:web:9cc7ec263ed8a8687c1bcf",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WEBSITE_SETTINGS_DOC = "website_settings";
const WEBSITE_SETTINGS_ID = "default";

async function main() {
  console.log("Updating website description in Firestore...");

  const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);
  
  // First, check current data
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Current description:", docSnap.data().description);
  } else {
    console.log("No existing settings document found.");
  }

  // Update with new description
  const newDescription = "Auto Import Specialists is Australia's premier import specialist, offering direct access to global auctions for luxury and performance vehicles. We handle sourcing, compliance, and delivery for your dream car with exceptional service and transparent pricing.";
  
  await updateDoc(docRef, {
    description: newDescription,
    // Also ensure other fields are clean of rental terms if they exist
    metaDescription: "Premium vehicle imports. Specialist sourcing for luxury and performance vehicles. Full compliance handling and Australia-wide delivery.",
    heroTitle: "Premium Global Imports",
    heroSubtitle: "Your trusted gateway to global vehicle markets.",
    testimonialsSubtitle: "Hear from those who have experienced our premium service",
    howItWorksSubtitle: "Importing your dream car is simple and transparent",
  });

  console.log("Updated description to:", newDescription);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
