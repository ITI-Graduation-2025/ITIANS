export const runtime = "nodejs";
import { NextResponse } from "next/server";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { exists: false, message: "No account found with this email address" },
        { status: 200 },
      );
    }

    // User exists
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return NextResponse.json(
      {
        exists: true,
        userId: userDoc.id,
        email: userData.email,
        message: "User found",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
