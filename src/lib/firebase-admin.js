import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Lazily initialize Firebase Admin to avoid throwing during import at build time
export function getAdmin() {
  if (admin.apps.length) return admin;

  let projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey || !projectId) {
    try {
      const serviceAccountPath = path.join(
        process.cwd(),
        "serviceAccount.json",
      );
      const raw = fs.readFileSync(serviceAccountPath, "utf8");
      const serviceAccount = JSON.parse(raw);
      projectId = serviceAccount.project_id;
      clientEmail = serviceAccount.client_email;
      privateKey = serviceAccount.private_key;
    } catch (err) {
      throw new Error(
        "Firebase Admin credentials missing: set env vars or add serviceAccount.json at project root",
      );
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin;
}

export { admin };
