// islam/layout.js
import { getServerSession } from "next-auth/next";
// import { getUser } from "@/services/firebase";
import { getUser } from "@/services/userServices";
import { UserProvider } from "@/context/userContext";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextAuth";

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  console.log(session, "session");
  // If no session, redirect to login
  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    const user = await getUser(session.user.id);
    if (!user || user === "User not found") {
      redirect("/404");
    }

    // Check user status
    if (
      user.verificationStatus === "Rejected" ||
      user.verificationStatus === "Suspended"
    ) {
      redirect("/rejected");
    }

    return <UserProvider initialUser={user}>{children}</UserProvider>;
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/login");
  }
}
