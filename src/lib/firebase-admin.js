import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Cache for admin instance
let adminInstance = null;

// Lazily initialize Firebase Admin to avoid throwing during import at build time
export function getAdmin() {
  if (adminInstance) return adminInstance;

  // Check if already initialized
  if (admin.apps.length > 0) {
    adminInstance = admin;
    return adminInstance;
  }

  let projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Clean up private key if it exists
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  // If environment variables are not set, try to read from serviceAccount.json
  if (!clientEmail || !privateKey || !projectId) {
    try {
      // Try multiple possible paths for serviceAccount.json
      const possiblePaths = [
        path.join(process.cwd(), "serviceAccount.json"),
        path.join(process.cwd(), "src", "config", "serviceAccount.json"),
        path.join(process.cwd(), "..", "serviceAccount.json"),
      ];

      for (const serviceAccountPath of possiblePaths) {
        if (fs.existsSync(serviceAccountPath)) {
          const raw = fs.readFileSync(serviceAccountPath, "utf8");
          const serviceAccount = JSON.parse(raw);
          projectId = serviceAccount.project_id;
          clientEmail = serviceAccount.client_email;
          privateKey = serviceAccount.private_key;
          // Service account loaded from
          break;
        }
      }

      if (!clientEmail || !privateKey || !projectId) {
        console.warn("⚠️ serviceAccount.json not found in any location");
      }
    } catch (err) {
      console.warn("⚠️ Could not read serviceAccount.json:", err.message);
    }
  }

  // Final check for required credentials
  if (!clientEmail || !privateKey || !projectId) {
    console.error("❌ Firebase Admin credentials missing!");
    console.error("Required environment variables:");
    console.error("- NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    console.error("- FIREBASE_CLIENT_EMAIL");
    console.error("- FIREBASE_PRIVATE_KEY");
    console.error("Or add serviceAccount.json at project root");

    // In development, throw error. In production, try to continue
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Firebase Admin credentials missing: set env vars or add serviceAccount.json at project root",
      );
    }

    // In production, try to use default Firebase config
    console.warn("⚠️ Using default Firebase config in production");
    return null;
  }

  try {
    // Initialize Firebase Admin
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    adminInstance = admin;
    // Firebase Admin initialized successfully
    return adminInstance;
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error.message);

    if (process.env.NODE_ENV === "development") {
      throw error;
    }

    return null;
  }
}

export { admin };
