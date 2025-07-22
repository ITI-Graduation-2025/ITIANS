"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/services/firebase";
import { useSession } from "next-auth/react";

export const UserContext = createContext();

export function UserProvider({ children, initialUser }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(initialUser || null);

  const fetchUser = async () => {
    if (session?.user?.id) {
      const fetchedUser = await getUser(session.user.id);
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
