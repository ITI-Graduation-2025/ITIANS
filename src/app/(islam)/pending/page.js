// app/(islam)/pending/page.js
import { PendingClient } from "@/components/pendingComp/pending-client";
import { authOptions } from "@/lib/nextAuth";
import { getUser } from "@/services/userServices";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function PendingPage() {
  // ✅ 1. Get the current session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  // console.log(session);
  if (!userId) {
    notFound();
  }

  // ✅ 2. Get user data from Firestore
  const user = await getUser(userId);
  // console.log(user);
  if (!user || user === "User not found") {
    notFound(); // Show 404 page
  }

  // ✅ 3. Check if user is actually pending
  if (user.verificationStatus !== "Pending" && !user.profileUnderReview) {
    // Redirect to appropriate page based on user role
    // console.log(user);
    if (user.role === "mentor") {
      redirect("/mentor");
    } else if (user.role === "freelancer") {
      redirect("/profile");
    }
  }

  return <PendingClient user={user} />;
}
