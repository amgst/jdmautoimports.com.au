import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

async function main() {
  // Assumes your dev server is running on port 5000
  const apiUrl = "http://localhost:5000/api/cars";
  console.log(`Fetching cars from ${apiUrl} ...`);

  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.status} ${res.statusText}`);
  }

  const cars = await res.json();

  if (!Array.isArray(cars)) {
    throw new Error("Unexpected response format for /api/cars");
  }

  console.log(`Seeding ${cars.length} cars to Firestore...`);

  for (const car of cars) {
    if (!car.slug) {
      console.warn("Skipping car without slug:", car);
      continue;
    }

    const ref = doc(db, "cars", car.slug);
    await setDoc(ref, car);
    console.log(`Saved car: ${car.slug}`);
  }

  console.log("Done seeding cars to Firestore.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});









