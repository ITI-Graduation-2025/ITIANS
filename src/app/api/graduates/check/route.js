import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";

// POST /api/graduates/check
// Body: { uid: string, nationalId: string, idToken: string }
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, nationalId, idToken } = body || {};

    if (!uid || !nationalId || !idToken) {
      return NextResponse.json(
        { error: "Missing uid, nationalId, or idToken" },
        { status: 400 },
      );
    }

    // Verify the Firebase ID token to ensure the caller is the same user
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded || decoded.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const firestore = admin.firestore();

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
        adminActionDate: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json({
      isGraduate,
      status: isGraduate ? "Approved" : "Pending",
    });
  } catch (error) {
    console.error("/api/graduates/check error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
