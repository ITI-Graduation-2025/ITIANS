import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Cache for admin instance
let adminInstance = null;

/**
 * Get Firebase Admin instance with proper initialization
 * Handles both environment variables and service account file fallback
 */
export function getAdmin() {
  // Return cached instance if already initialized
  if (adminInstance) {
    return adminInstance;
  }

  // Check if Firebase Admin is already initialized
  if (admin.apps.length > 0) {
    adminInstance = admin;
    return adminInstance;
  }

  try {
    // Try to initialize with environment variables first
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.CLIENT_EMAIL;
    let privateKey = process.env.PRIVATE_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

    console.log("🔍 Environment variables check:");
    console.log(
      "- NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
      projectId ? "✅ Set" : "❌ Missing",
    );
    console.log(
      "- FIREBASE_CLIENT_EMAIL:",
      clientEmail ? "✅ Set" : "❌ Missing",
    );
    console.log(
      "- FIREBASE_PRIVATE_KEY:",
      privateKey ? "✅ Set" : "❌ Missing",
    );
    console.log(
      "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:",
      storageBucket ? "✅ Set" : "❌ Missing",
    );

    // Clean up private key - replace \\n with actual newlines
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    // If all required env vars are present, use them
    if (projectId && clientEmail && privateKey) {
      console.log("✅ Initializing Firebase Admin with environment variables");
      console.log("📋 Project ID:", projectId);

      const app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
        storageBucket,
        databaseURL: `https://${projectId}.firebaseio.com`,
      });

      adminInstance = admin;
      console.log("✅ Firebase Admin initialized successfully with env vars");
      return adminInstance;
    }

    // Fallback to service account file (for local development)
    console.log(
      "⚠️ Environment variables not found, trying service account file...",
    );

    const serviceAccountPath = path.join(process.cwd(), "serviceAccount.json");

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf8"),
      );

      console.log("✅ Loading service account from:", serviceAccountPath);
      console.log("📋 Service Account Project ID:", serviceAccount.project_id);

      const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket:
          serviceAccount.storage_bucket ||
          `${serviceAccount.project_id}.appspot.com`,
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });

      adminInstance = admin;
      console.log(
        "✅ Firebase Admin initialized successfully with service account",
      );
      return adminInstance;
    }

    // No credentials found
    console.error("❌ Firebase Admin credentials not found!");
    console.error("Required environment variables:");
    console.error("- NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    console.error("- FIREBASE_CLIENT_EMAIL");
    console.error("- FIREBASE_PRIVATE_KEY");
    console.error("Or add serviceAccount.json at project root");

    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Firebase Admin credentials missing. Set environment variables or add serviceAccount.json",
      );
    }

    // In production, return null to allow graceful degradation
    console.error("❌ Firebase Admin not available in production");
    return null;
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error.message);

    if (process.env.NODE_ENV === "development") {
      throw error;
    }

    // In production, return null to allow graceful degradation
    console.error("❌ Firebase Admin initialization failed in production");
    return null;
  }
}

/**
 * Check if Firebase Admin is properly initialized
 */
export function isAdminInitialized() {
  try {
    const admin = getAdmin();
    return admin !== null && admin.apps.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get Firestore instance safely
 */
export function getFirestore() {
  const admin = getAdmin();
  if (!admin) {
    throw new Error("Firebase Admin not initialized");
  }
  return admin.firestore();
}

/**
 * Get Auth instance safely
 */
export function getAuth() {
  const admin = getAdmin();
  if (!admin) {
    throw new Error("Firebase Admin not initialized");
  }
  return admin.auth();
}

/**
 * Get Firestore FieldValue for serverTimestamp and other field operations
 */
export function getFieldValue() {
  const admin = getAdmin();
  if (!admin) {
    throw new Error("Firebase Admin not initialized");
  }
  return admin.firestore.FieldValue;
}

// Export the admin instance for direct access (use with caution)
export { admin };
