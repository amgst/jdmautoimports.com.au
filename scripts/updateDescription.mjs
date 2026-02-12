
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
  const newDescription = "JDM Auto Imports is a leading Australian importer and dealership dedicated to genuine Japanese Domestic Market vehicles. From rare performance icons to premium daily drivers, we connect Australia with Japan’s finest cars through expert sourcing, compliance, and unmatched attention to detail.";
  
  await updateDoc(docRef, {
    description: newDescription,
    websiteName: "JDM Auto Import",
    companyName: "JDM Auto Import",
    email: "info@jdmautoimports.com.au",
    phone: "+61 469 440 944",
    address: "6/1353 The Horsley Drive, Wetherill Park, NSW 2164, Australia",
    licenseNumber: "NSW Motor Dealer Licence # MD094267",
    businessHours: "Mon - Fri: 9:00 AM - 6:00 PM | Sat - Sun: 10:00 AM - 4:00 PM | Open with Appointments too",
    // Also ensure other fields are clean of rental terms if they exist
    metaDescription: "JDM Auto Imports is a leading Australian importer and dealership dedicated to genuine Japanese Domestic Market vehicles. Expert sourcing, compliance, and delivery.",
    heroTitle: "Genuine JDM Imports",
    heroSubtitle: "Your leading Australian gateway to Japan's finest domestic market vehicles.",
    testimonialsSubtitle: "Hear from those who have experienced our professional JDM sourcing",
    howItWorksSubtitle: "Connecting Australia with Japan's finest cars is simple and transparent",
    // Stats Section
    showStatsSection: true,
    stats1Value: "10+",
    stats1Label: "Years Experience",
    stats2Value: "200+",
    stats2Label: "Imports",
    stats3Value: "100%",
    stats3Label: "Grade Certified",
    stats4Value: "",
    stats4Label: "",
  });

  console.log("Updated description to:", newDescription);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
