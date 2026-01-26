import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, "..", ".env") });

// Firebase client config – reads from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Simple validation
if (!firebaseConfig.apiKey) {
  console.error("Error: VITE_FIREBASE_API_KEY is missing from .env file");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Read the cars data from JSON file
  const dataPath = join(__dirname, "..", "data", "10-cars-data.json");
  console.log(`Reading cars data from ${dataPath}...`);

  const fileContent = readFileSync(dataPath, "utf-8");
  const cars = JSON.parse(fileContent);

  console.log(`Seeding ${cars.length} cars to Firestore...`);

  for (const car of cars) {
    // Generate slug from name
    const slug = generateSlug(car.name);

    // Prepare car data with slug
    const carData = {
      ...car,
      slug: slug,
    };

    try {
      // Add car to Firestore collection
      const docRef = await addDoc(collection(db, "cars"), carData);
      console.log(`✓ Saved car: ${car.name} (ID: ${docRef.id}, Slug: ${slug})`);
    } catch (error) {
      console.error(`✗ Failed to save car: ${car.name}`, error.message);
    }
  }

  console.log("\n✅ Done seeding cars to Firestore!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});


