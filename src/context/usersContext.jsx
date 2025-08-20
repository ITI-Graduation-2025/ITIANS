"use client";

import React, { createContext, useState, useEffect } from "react";
// import { getAllUsers, subscribeToUsers } from "@/services/firebase";
import { getAllUsers, subscribeToUsers } from "@/services/userServices";
import { addListener, removeListener } from "@/config/firebase";

export const UsersContext = createContext();

export const UsersProvider = ({ children, initialUsers = [] }) => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    console.log("Setting up users subscription...");
    const unsubscribe = subscribeToUsers((newUsers) => {
      setUsers((prevUsers) => {
        if (JSON.stringify(prevUsers) !== JSON.stringify(newUsers)) {
          return newUsers;
        }
        return prevUsers;
      });
    });

    // إضافة المستمع إلى نظام التتبع
    addListener(unsubscribe);
    console.log("Users subscription added to listener management");

    return () => {
      console.log("Cleaning up users subscription...");
      // إزالة المستمع من نظام التتبع
      removeListener(unsubscribe);
      // إغلاق المستمع
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};
