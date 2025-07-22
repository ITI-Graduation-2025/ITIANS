// islam/layout.js
import { getServerSession } from "next-auth/next";
import { getUser } from "@/services/firebase";
import { UserProvider } from "@/context/userContext";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextAuth";

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const user = await getUser(session.user.id);
  if (!user) {
    redirect("/404");
  }
  if (["rejected", "suspended"].includes(user.status)) {
    redirect("/rejected");
  }
  return <UserProvider initialUser={user}>{children}</UserProvider>;
}
