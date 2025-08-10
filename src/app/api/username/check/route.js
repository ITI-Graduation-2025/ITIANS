import { NextResponse } from "next/server";
import { isUsernameAvailable } from "@/services/userServices";

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const available = await isUsernameAvailable(username);

    return NextResponse.json({
      username,
      available,
      message: available ? "Username is available" : "Username is taken",
    });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 },
    );
  }
}
