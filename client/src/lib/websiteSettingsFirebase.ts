import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const WEBSITE_SETTINGS_DOC = "website_settings";
const WEBSITE_SETTINGS_ID = "default";

export interface WebsiteSettings {
  websiteName: string;
  logo: string; // URL or path to logo
  favicon: string; // URL or path to favicon
  companyName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  facebookUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroLearnMoreText?: string;
  heroLearnMoreLink?: string;

  // Pages
  termsAndConditions?: string;
}

const defaultWebsiteSettings: WebsiteSettings = {
  websiteName: "Premium Car Rentals Australia",
  logo: "",
  favicon: "/favicon.png",
  companyName: "Premium Car Rentals Australia",
  email: "info@premiumcarrentals.com.au",
  phone: "+61 2 9999 8888",
  address: "123 Premium Street, Sydney, NSW 2000, Australia",
  description: "Australia's premier car rental service offering luxury vehicles, premium sedans, SUVs, and sports cars. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates.",
  facebookUrl: "",
  xUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  metaDescription: "Premium car rental in Australia. Choose from luxury sedans, SUVs, sports cars and more. Best rates, flexible bookings, and exceptional service across Sydney, Melbourne, Brisbane, Perth, and Adelaide. Book your dream car today.",
  metaKeywords: "car rental Australia, luxury car hire Australia, premium car rental Sydney, car hire Melbourne, rent car Brisbane, vehicle rental Perth, car rental Adelaide, Australia car hire, premium vehicles Australia, luxury cars Australia",

  // Hero Defaults
  heroTitle: "Premium Car Rentals Australia",
  heroSubtitle: "Experience luxury and performance with Australia's finest collection of premium vehicles. Available across Sydney, Melbourne, Brisbane, Perth, and Adelaide.",
  heroImage: "", // Will fall back to default if empty
  heroButtonText: "Browse Our Fleet",
  heroButtonLink: "/cars",
  heroLearnMoreText: "Learn More",
  heroLearnMoreLink: "#features",

  // Pages Defaults
  termsAndConditions: `## Agreement to Terms
By accessing our website and using our car rental services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.

## 1. Use License
Permission is granted to temporarily view the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
* Modify or copy the materials;
* Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
* Attempt to decompile or reverse engineer any software contained on our website;
* Remove any copyright or other proprietary notations from the materials; or
* Transfer the materials to another person or "mirror" the materials on any other server.

## 2. Disclaimer
The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## 3. Limitations
In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.

## 4. Accuracy of Materials
The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete or current. We may make changes to the materials contained on our website at any time without notice.

## 5. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of the location of our headquarters and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`,
};

/**
 * Get website settings from Firebase
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as WebsiteSettings;
      // Merge with defaults to ensure all fields exist
      return { ...defaultWebsiteSettings, ...data };
    }

    // Return defaults if no settings exist
    return defaultWebsiteSettings;
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return defaultWebsiteSettings;
  }
}

/**
 * Save website settings to Firebase
 */
export async function saveWebsiteSettings(
  settings: WebsiteSettings
): Promise<void> {
  try {
    console.log("Attempting to save website settings:", settings);
    const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);

    // Clean up the data - remove undefined values and ensure all required fields exist
    const dataToSave: Record<string, any> = {
      websiteName: settings.websiteName || "",
      logo: settings.logo || "",
      favicon: settings.favicon || "/favicon.png",
      companyName: settings.companyName || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || "",
      description: settings.description || "",
    };

    // Only include optional fields if they have values (Firestore doesn't accept undefined)
    if (settings.facebookUrl && settings.facebookUrl.trim()) {
      dataToSave.facebookUrl = settings.facebookUrl;
    }
    if (settings.xUrl && settings.xUrl.trim()) {
      dataToSave.xUrl = settings.xUrl;
    }
    if (settings.instagramUrl && settings.instagramUrl.trim()) {
      dataToSave.instagramUrl = settings.instagramUrl;
    }
    if (settings.linkedinUrl && settings.linkedinUrl.trim()) {
      dataToSave.linkedinUrl = settings.linkedinUrl;
    }
    if (settings.metaDescription && settings.metaDescription.trim()) {
      dataToSave.metaDescription = settings.metaDescription;
    }
    if (settings.metaKeywords && settings.metaKeywords.trim()) {
      dataToSave.metaKeywords = settings.metaKeywords;
    }

    // Hero Section Fields
    if (settings.heroTitle !== undefined) dataToSave.heroTitle = settings.heroTitle;
    if (settings.heroSubtitle !== undefined) dataToSave.heroSubtitle = settings.heroSubtitle;
    if (settings.heroImage !== undefined) dataToSave.heroImage = settings.heroImage;
    if (settings.heroButtonText !== undefined) dataToSave.heroButtonText = settings.heroButtonText;
    if (settings.heroButtonLink !== undefined) dataToSave.heroButtonLink = settings.heroButtonLink;
    if (settings.heroLearnMoreText !== undefined) dataToSave.heroLearnMoreText = settings.heroLearnMoreText;
    if (settings.heroLearnMoreLink !== undefined) dataToSave.heroLearnMoreLink = settings.heroLearnMoreLink;

    // Pages
    if (settings.termsAndConditions !== undefined) dataToSave.termsAndConditions = settings.termsAndConditions;

    console.log("Data to save to Firestore:", dataToSave);
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("Successfully saved website settings to Firestore");
  } catch (error) {
    console.error("Error saving website settings:", error);
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to save website settings: ${error.message}`);
    } else {
      const errorStr = String(error);
      throw new Error(`Failed to save website settings: ${errorStr}`);
    }
  }
}
