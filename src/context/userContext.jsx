"use client";
import { createContext, useContext, useState, useEffect } from "react";
// import { getUser } from "@/services/firebase";
import { getUser } from "@/services/userServices";
import { useSession } from "next-auth/react";

export const UserContext = createContext();

export function UserProvider({ children, initialUser }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(initialUser || null);

  const fetchUser = async () => {
    if (session?.user?.id) {
      const fetchedUser = await getUser(session.user.id);
      // تحويل createdAt لـ string باستخدام toISOString إذا كان Timestamp
      if (
        fetchedUser &&
        fetchedUser.createdAt &&
        typeof fetchedUser.createdAt.toDate === "function"
      ) {
        fetchedUser.createdAt = fetchedUser.createdAt.toDate().toISOString();
      }
      // لو فيه حاجات تانية معقدة، زي مصفوفات أو كائنات فرعية، نحولها كمان
      setUser(fetchedUser);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session?.user?.id]);

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
