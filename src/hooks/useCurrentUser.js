//src/hooks/useCurrentUser.js

"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useCurrentUser() {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("Firebase Current User:", user);

      if (session?.user) {
        // console.log("NextAuth session user:", session.user);
        setCurrentUser({
          uid: session.user.id || user?.uid,
          email: session.user.email || user?.email,
          name: session.user.name,
          role: session.user.role || "freelancer",
          profileImage: session.user.profileImage || "",
        });
      } else if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous",
          role: "freelancer",
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [session]);

  return currentUser;
}
