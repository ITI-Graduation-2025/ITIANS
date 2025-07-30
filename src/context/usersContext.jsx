"use client";

import React, { createContext, useState, useEffect } from "react";
import { getAllUsers, subscribeToUsers } from "@/services/firebase";

export const UsersContext = createContext();

export const UsersProvider = ({ children, initialUsers = [] }) => {
  const [users, setUsers] = useState(initialUsers);

  // Optional: re-fetch after mount (for realtime freshness)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const fetched = await getAllUsers();
  //       setUsers(fetched);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const unsubscribe = subscribeToUsers((newUsers) => {
      setUsers((prevUsers) => {
        if (JSON.stringify(prevUsers) !== JSON.stringify(newUsers)) {
          return newUsers;
        }
        return prevUsers;
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};
