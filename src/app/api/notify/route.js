export const runtime = "nodejs";
import { getAdmin } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, title, body, data } = await request.json();

    if (!token || !title || !body) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    const admin = getAdmin();

    // Check if admin is properly initialized
    if (!admin || !admin.messaging) {
      console.error("❌ Firebase Admin not properly initialized");
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin not initialized",
          details:
            "Check environment variables and service account configuration",
        },
        { status: 500 },
      );
    }

    const message = {
      notification: { title, body },
      token,
      webpush: {
        fcmOptions: {
          link: data?.url || "/",
        },
      },
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json(
      {
        success: true,
        messageId: response,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error in /api/notify:", error);

    // More detailed error logging
    if (error.code) {
      console.error("Firebase Error Code:", error.code);
    }
    if (error.message) {
      console.error("Error Message:", error.message);
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error occurred",
        code: error.code || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
