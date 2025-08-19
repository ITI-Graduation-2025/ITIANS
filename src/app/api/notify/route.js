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

    const message = {
      notification: { title, body },
      token,
      webpush: {
        fcmOptions: {
          link: data?.url || "/",
        },
      },
    };

    const admin = getAdmin();
    const response = await admin.messaging().send(message);
    console.log("Push notification sent successfully:", response);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/notify:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
