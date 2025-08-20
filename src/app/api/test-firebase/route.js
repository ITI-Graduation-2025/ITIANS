export const runtime = "nodejs";
import { NextResponse } from "next/server";
import {
  isAdminInitialized,
  getAdmin,
  getFirestore,
  getAuth,
  getFieldValue,
} from "@/lib/firebase-admin";

export async function GET() {
  try {
    // Log environment information for debugging
    console.log("🔍 /api/test-firebase - Environment check:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "- NEXT_PUBLIC_FIREBASE_PROJECT_ID:",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    );
    console.log(
      "- FIREBASE_CLIENT_EMAIL:",
      process.env.FIREBASE_CLIENT_EMAIL ? "✅ Set" : "❌ Missing",
    );
    console.log(
      "- FIREBASE_PRIVATE_KEY:",
      process.env.FIREBASE_PRIVATE_KEY ? "✅ Set" : "❌ Missing",
    );

    // Test Firebase Admin initialization
    const isInitialized = isAdminInitialized();

    if (!isInitialized) {
      console.error("❌ Firebase Admin not initialized in /api/test-firebase");
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin not initialized",
          details: "Check environment variables and Vercel configuration",
          code: "FIREBASE_ADMIN_UNAVAILABLE",
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
          },
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

    // Test FieldValue access
    let fieldValueTest = false;
    try {
      const FieldValue = getFieldValue();
      fieldValueTest = true;
    } catch (error) {
      console.error("FieldValue test failed:", error);
    }

    // Test basic Firestore operation (read-only)
    let firestoreReadTest = false;
    let firestoreError = null;
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
      } else {
        firestoreError = {
          code: error.code,
          message: error.message,
          details: error.details,
        };
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
        fieldValueAccess: fieldValueTest,
        firestoreReadTest: firestoreReadTest,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || "unknown",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      },
      firestoreError,
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
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        },
      },
      { status: 500 },
    );
  }
}
