import { db, isFirebaseInitialized } from "./firebase";
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

  // Featured Section
  featuredTitle?: string;
  featuredSubtitle?: string;

  // How It Works Section
  howItWorksTitle?: string;
  howItWorksSubtitle?: string;
  howItWorksStep1Title?: string;
  howItWorksStep1Description?: string;
  howItWorksStep2Title?: string;
  howItWorksStep2Description?: string;
  howItWorksStep3Title?: string;
  howItWorksStep3Description?: string;

  // Stats Section
  stats1Value?: string;
  stats1Label?: string;
  stats2Value?: string;
  stats2Label?: string;
  stats3Value?: string;
  stats3Label?: string;
  stats4Value?: string;
  stats4Label?: string;

  // Testimonials Section
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonial1Name?: string;
  testimonial1Role?: string;
  testimonial1Content?: string;
  testimonial2Name?: string;
  testimonial2Role?: string;
  testimonial2Content?: string;

  // CTA Section
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;

  // Pages
  termsAndConditions?: string;
  maintenanceMode?: boolean;
}

const defaultWebsiteSettings: WebsiteSettings = {
  websiteName: "JDM Auto Imports",
  logo: "",
  favicon: "/favicon.png",
  companyName: "JDM Auto Imports",
  email: "info@premiumcarrentals.com.au",
  phone: "+61 2 9999 8888",
  address: "123 Premium Street, Sydney, NSW 2000, Australia",
  description: "Australia's premier car rental service offering luxury vehicles, premium sedans, SUVs, and sports cars. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates.",
  facebookUrl: "",
  xUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  metaDescription: "JDM Auto Imports offers premium JDM and luxury car rentals in Australia. Choose from our exclusive fleet of Japanese imports and high-performance vehicles.",
  metaKeywords: "JDM imports, car rental Australia, luxury car hire Australia, JDM Auto Imports, Japanese car rental Sydney, performance car hire Melbourne",

  // Hero Defaults
  heroTitle: "JDM Auto Imports",
  heroSubtitle: "Experience luxury and performance with Australia's finest collection of premium vehicles.",
  heroImage: "", // Will fall back to default if empty
  heroButtonText: "Browse Our Fleet",
  heroButtonLink: "/cars",
  heroLearnMoreText: "Learn More",
  heroLearnMoreLink: "#features",

  // Featured Defaults
  featuredTitle: "Featured Vehicles",
  featuredSubtitle: "Discover our most popular luxury and performance cars",

  // How It Works Defaults
  howItWorksTitle: "How It Works",
  howItWorksSubtitle: "Renting a car has never been easier",
  howItWorksStep1Title: "Choose Your Car",
  howItWorksStep1Description: "Browse our extensive fleet and select the perfect vehicle for your needs",
  howItWorksStep2Title: "Book Online",
  howItWorksStep2Description: "Complete your reservation quickly and securely through our platform",
  howItWorksStep3Title: "Hit the Road",
  howItWorksStep3Description: "Pick up your vehicle and enjoy your journey with confidence",

  // Stats Defaults
  stats1Value: "1000+",
  stats1Label: "Happy Customers",
  stats2Value: "50+",
  stats2Label: "Premium Vehicles",
  stats3Value: "5",
  stats3Label: "Locations",
  stats4Value: "24/7",
  stats4Label: "Support",

  // Testimonials Defaults
  testimonialsTitle: "What Our Customers Say",
  testimonialsSubtitle: "Hear from those who have experienced our premium service",
  testimonial1Name: "James Davidson",
  testimonial1Role: "Business Executive",
  testimonial1Content: "Outstanding service! The Tesla Model 3 was in perfect condition, and the booking process was seamless. JDM Auto Imports made my business trip incredibly convenient.",
  testimonial2Name: "Sarah Martinez",
  testimonial2Role: "Family Traveler",
  testimonial2Content: "We rented the BMW X5 for our family vacation and it was perfect! Spacious, comfortable, and the customer support was fantastic. Highly recommend!",

  // CTA Defaults
  ctaTitle: "Ready to Start Your Journey?",
  ctaSubtitle: "Book your premium vehicle today and experience the road like never before",
  ctaButtonText: "Book Now",
  ctaButtonLink: "/cars",

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
  maintenanceMode: false,
};

/**
 * Get website settings from Firebase
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    if (!isFirebaseInitialized) return defaultWebsiteSettings;

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
    if (!isFirebaseInitialized) {
      throw new Error("Firebase is not initialized. Please check your environment variables (.env).");
    }

    console.log("Attempting to save website settings:", settings);
    const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);

    // Clean up the data - remove undefined values
    const dataToSave: Record<string, any> = {};

    // Spread all settings and then override/clean specific ones
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== undefined) {
        dataToSave[key] = value;
      }
    });

    // Ensure core fields have defaults if empty
    dataToSave.websiteName = dataToSave.websiteName || "JDM Auto Imports";
    dataToSave.companyName = dataToSave.companyName || "JDM Auto Imports";
    dataToSave.favicon = dataToSave.favicon || "/favicon.png";
    dataToSave.maintenanceMode = !!dataToSave.maintenanceMode;

    console.log("Data to save to Firestore:", dataToSave);
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("Successfully saved website settings to Firestore");
  } catch (error) {
    console.error("Error saving website settings:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

