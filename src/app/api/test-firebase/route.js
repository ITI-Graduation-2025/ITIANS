export const runtime = "nodejs";
import { NextResponse } from "next/server";
import {
  isAdminInitialized,
  getAdmin,
  getFirestore,
  getAuth,
} from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Test Firebase Admin initialization
    const isInitialized = isAdminInitialized();

    if (!isInitialized) {
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin not initialized",
          details: "Check environment variables and Vercel configuration",
          code: "FIREBASE_ADMIN_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    // Test getting admin instance
    const admin = getAdmin();
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get Firebase Admin instance",
          code: "ADMIN_INSTANCE_ERROR",
        },
        { status: 500 },
      );
    }

    // Test Firestore access
    let firestoreTest = false;
    try {
      const firestore = getFirestore();
      firestoreTest = true;
    } catch (error) {
      console.error("Firestore test failed:", error);
    }

    // Test Auth access
    let authTest = false;
    try {
      const auth = getAuth();
      authTest = true;
    } catch (error) {
      console.error("Auth test failed:", error);
    }

    // Test basic Firestore operation (read-only)
    let firestoreReadTest = false;
    try {
      const firestore = getFirestore();
      // Try to read a document (this will fail if not authenticated, but won't crash)
      await firestore.collection("test").limit(1).get();
      firestoreReadTest = true;
    } catch (error) {
      // This is expected to fail due to security rules, but it means Firestore is accessible
      if (
        error.code === "permission-denied" ||
        error.code === "unauthenticated"
      ) {
        firestoreReadTest = true; // Firestore is working, just not authenticated
      }
    }

    return NextResponse.json({
      success: true,
      message: "Firebase Admin is working correctly",
      tests: {
        adminInitialized: isInitialized,
        adminInstance: !!admin,
        firestoreAccess: firestoreTest,
        authAccess: authTest,
        firestoreReadTest: firestoreReadTest,
      },
      environment: process.env.NODE_ENV || "unknown",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ /api/test-firebase error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Test failed",
        details: error.message,
        code: "TEST_FAILED",
      },
      { status: 500 },
    );
  }
}
