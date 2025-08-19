import { NextResponse } from "next/server";
import { getUserByUsername } from "@/services/userServices";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    const user = await getUserByUsername(username);

    if (user === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only necessary user data for mentions
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      photoURL: user.photoURL || null,
    };

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search for user" },
      { status: 500 },
    );
  }
}
