import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

// Old Firebase configuration
const oldFirebaseConfig = {
    apiKey: "AIzaSyCMdH8eoSXk9M8icxWB7cd3neS84faMbr0",
    authDomain: "cars-4ecea.firebaseapp.com",
    projectId: "cars-4ecea",
    storageBucket: "cars-4ecea.firebasestorage.app",
    messagingSenderId: "254741947742",
    appId: "1:254741947742:web:9cc7ec263ed8a8687c1bcf",
};

// New Firebase configuration
const newFirebaseConfig = {
    apiKey: "AIzaSyDh2SrZ0azQfANH-Rgb6y9lxtvmLF_B_Ao",
    authDomain: "jdmautoimports-b52f0.firebaseapp.com",
    projectId: "jdmautoimports-b52f0",
    storageBucket: "jdmautoimports-b52f0.firebasestorage.app",
    messagingSenderId: "866374087987",
    appId: "1:866374087987:web:8873d8336a912cc2c0fa46"
};

// Initialize apps
const oldApp = initializeApp(oldFirebaseConfig, "old");
const newApp = initializeApp(newFirebaseConfig, "new");

const oldDb = getFirestore(oldApp);
const newDb = getFirestore(newApp);

const COLLECTIONS = ["cars", "bookings"];

async function migrateCollection(collectionName) {
    console.log(`Migrating collection: ${collectionName}...`);
    const snap = await getDocs(collection(oldDb, collectionName));
    console.log(`Found ${snap.size} documents in ${collectionName}.`);

    for (const docSnap of snap.docs) {
        const data = docSnap.data();
        await setDoc(doc(newDb, collectionName, docSnap.id), data);
        console.log(`Migrated ${collectionName}/${docSnap.id}`);
    }
    console.log(`Finished migrating ${collectionName}.`);
}

async function main() {
    for (const col of COLLECTIONS) {
        await migrateCollection(col);
    }
    console.log("Migration complete!");
}

main().catch(console.error);
