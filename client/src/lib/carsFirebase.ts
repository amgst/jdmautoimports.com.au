import { db, isFirebaseInitialized } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import type { Car, InsertCar } from "@shared/schema";

const CARS_COLLECTION = "cars";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export async function getAllCarsFirebase(): Promise<Car[]> {
  if (!isFirebaseInitialized) return [];
  const snap = await getDocs(collection(db, CARS_COLLECTION));
  const cars: Car[] = [];

  snap.forEach((docSnap) => {
    const data = docSnap.data() as Car;
    // Ensure images is always an array and id is set
    cars.push({
      ...data,
      id: data.id || docSnap.id, // Use document ID if id field is missing
      images: ensureArray(data.images as any),
    });
  });

  return cars;
}

export async function getCarBySlugFirebase(slug: string): Promise<Car | undefined> {
  if (!isFirebaseInitialized) return undefined;
  const q = query(
    collection(db, CARS_COLLECTION),
    where("slug", "==", slug),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;

  const data = snap.docs[0].data() as Car;
  return {
    ...data,
    id: data.id || snap.docs[0].id, // Ensure id is set using document ID if missing
    images: ensureArray(data.images as any),
  };
}

export async function getCarByIdFirebase(id: string): Promise<Car | undefined> {
  if (!isFirebaseInitialized) return undefined;
  if (!id) {
    console.error("getCarByIdFirebase: id is required");
    return undefined;
  }

  console.log("getCarByIdFirebase: Searching for car with id:", id);

  const q = query(
    collection(db, CARS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    console.warn("getCarByIdFirebase: No car found with id:", id);
    // Try using the id as document ID as fallback
    try {
      const docRef = doc(collection(db, CARS_COLLECTION), id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Car;
        console.log("getCarByIdFirebase: Found car using document ID");
        return {
          ...data,
          id: data.id || docSnap.id,
          images: ensureArray(data.images as any),
        };
      }
    } catch (err) {
      console.error("getCarByIdFirebase: Error trying document ID lookup:", err);
    }
    return undefined;
  }

  const data = snap.docs[0].data() as Car;
  console.log("getCarByIdFirebase: Found car:", data.name);
  return {
    ...data,
    id: data.id || snap.docs[0].id, // Ensure id is set
    images: ensureArray(data.images as any),
  };
}

export async function createCarFirebase(input: InsertCar): Promise<Car> {
  const id = crypto.randomUUID();
  const slug = generateSlug(input.name);

  const car: Car = {
    ...(input as any),
    id,
    slug,
    images: ensureArray(input.images as any),
  };

  await addDoc(collection(db, CARS_COLLECTION), car);
  return car;
}

export async function updateCarFirebase(id: string, input: InsertCar): Promise<Car | undefined> {
  const q = query(
    collection(db, CARS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;

  const docRef = snap.docs[0].ref;
  const slug = generateSlug(input.name);

  const updated: Car = {
    ...(input as any),
    id,
    slug,
    images: ensureArray(input.images as any),
  };

  await updateDoc(docRef, updated as any);
  return updated;
}

export async function duplicateCarFirebase(id: string): Promise<Car | undefined> {
  const originalCar = await getCarByIdFirebase(id);
  if (!originalCar) return undefined;

  const newId = crypto.randomUUID();
  const newName = `${originalCar.name} (Copy)`;
  const newSlug = `${originalCar.slug}-copy-${Math.floor(Math.random() * 1000)}`;

  const duplicatedCar: Car = {
    ...originalCar,
    id: newId,
    name: newName,
    slug: newSlug,
  };

  await addDoc(collection(db, CARS_COLLECTION), duplicatedCar);
  return duplicatedCar;
}

export async function deleteCarFirebase(id: string): Promise<boolean> {
  if (!id) {
    console.error("deleteCarFirebase: id is required");
    throw new Error("Car ID is required for deletion");
  }

  console.log("deleteCarFirebase: Attempting to delete car with id:", id);

  try {
    // First, try to find by the id field
    const q = query(
      collection(db, CARS_COLLECTION),
      where("id", "==", id),
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      console.log("deleteCarFirebase: Found car by id field, deleting document:", docRef.id);
      await deleteDoc(docRef);
      console.log("deleteCarFirebase: Car deleted successfully");
      return true;
    }

    // If not found by id field, try using the id as document ID
    console.log("deleteCarFirebase: Car not found by id field, trying document ID");
    try {
      const docRef = doc(collection(db, CARS_COLLECTION), id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("deleteCarFirebase: Found car by document ID, deleting");
        await deleteDoc(docRef);
        console.log("deleteCarFirebase: Car deleted successfully");
        return true;
      }
    } catch (docIdError) {
      console.error("deleteCarFirebase: Error trying document ID lookup:", docIdError);
    }

    console.warn("deleteCarFirebase: Car not found with id:", id);
    throw new Error(`Car with ID "${id}" not found`);
  } catch (error) {
    console.error("deleteCarFirebase: Error deleting car:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete car");
  }
}









