import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const PRICING_SETTINGS_DOC = "pricing_settings";
const PRICING_SETTINGS_ID = "default";

export interface PricingSettings {
  insuranceRatePerDay: number;
  deliveryFlatRate: number;
  minimumRentalDays: number;
  maximumRentalDays: number;
  taxRate: number; // as percentage (e.g., 10 for 10%)
  enableInsurance: boolean;
  enableDelivery: boolean;
  enableTax: boolean;
}

const defaultPricingSettings: PricingSettings = {
  insuranceRatePerDay: 25,
  deliveryFlatRate: 75,
  minimumRentalDays: 1,
  maximumRentalDays: 30,
  taxRate: 10,
  enableInsurance: true,
  enableDelivery: true,
  enableTax: false,
};

/**
 * Get pricing settings from Firebase
 */
export async function getPricingSettings(): Promise<PricingSettings> {
  try {
    const docRef = doc(db, PRICING_SETTINGS_DOC, PRICING_SETTINGS_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as PricingSettings;
    }
    
    // Return defaults if no settings exist
    return defaultPricingSettings;
  } catch (error) {
    console.error("Error fetching pricing settings:", error);
    return defaultPricingSettings;
  }
}

/**
 * Save pricing settings to Firebase
 */
export async function savePricingSettings(
  settings: PricingSettings
): Promise<void> {
  try {
    const docRef = doc(db, PRICING_SETTINGS_DOC, PRICING_SETTINGS_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error saving pricing settings:", error);
    throw error;
  }
}

