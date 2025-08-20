export const runtime = "nodejs";
import { NextResponse } from "next/server";
import {
  getAdmin,
  getAuth,
  getFirestore,
  isAdminInitialized,
} from "@/lib/firebase-admin";

// POST /api/graduates/check
// Body: { uid: string, nationalId: string, idToken: string }
export async function POST(request) {
  try {
    // Check if Firebase Admin is initialized first
    if (!isAdminInitialized()) {
      console.error(
        "❌ Firebase Admin not initialized in /api/graduates/check",
      );
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Firebase Admin service is not available",
          code: "FIREBASE_ADMIN_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { uid, nationalId, idToken } = body || {};

    if (!uid || !nationalId || !idToken) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "uid, nationalId, and idToken are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    try {
      // Verify the Firebase ID token
      const auth = getAuth();
      const decoded = await auth.verifyIdToken(idToken);

      if (!decoded || decoded.uid !== uid) {
        return NextResponse.json(
          {
            error: "Unauthorized",
            details: "Invalid or mismatched ID token",
            code: "UNAUTHORIZED",
          },
          { status: 401 },
        );
      }

      // Get Firestore instance
      const firestore = getFirestore();

      // Find graduate by nationalId
      const gradsSnap = await firestore
        .collection("graduates")
        .where("nationalId", "==", String(nationalId))
        .limit(1)
        .get();

      const isGraduate = !gradsSnap.empty;

      // Update user document status accordingly
      const userRef = firestore.collection("users").doc(uid);
      await userRef.set(
        {
          verificationStatus: isGraduate ? "Approved" : "Pending",
          adminActionDate: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return NextResponse.json({
        success: true,
        isGraduate,
        status: isGraduate ? "Approved" : "Pending",
        message: isGraduate
          ? "Graduate verification successful"
          : "Verification pending - not found in graduates database",
      });
    } catch (firebaseError) {
      console.error("Firebase operation failed:", firebaseError);

      if (firebaseError.code === "auth/id-token-expired") {
        return NextResponse.json(
          {
            error: "Token expired",
            details: "Please refresh your authentication token",
            code: "TOKEN_EXPIRED",
          },
          { status: 401 },
        );
      }

      if (firebaseError.code === "auth/id-token-revoked") {
        return NextResponse.json(
          {
            error: "Token revoked",
            details: "Please re-authenticate",
            code: "TOKEN_REVOKED",
          },
          { status: 401 },
        );
      }

      throw firebaseError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("❌ /api/graduates/check error:", error);

    // Handle specific error types
    if (error.message?.includes("Firebase Admin not initialized")) {
      return NextResponse.json(
        {
          error: "Service unavailable",
          details: "Firebase Admin service is not available",
          code: "SERVICE_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
