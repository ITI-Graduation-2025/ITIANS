
// context/NotificationsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { listenToNotifications } from "@/services/notificationService";

const NotificationsContext = createContext();

export function NotificationsProvider({ companyId, children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!companyId) return;
    const unsubscribe = listenToNotifications(companyId, setNotifications);
    return () => unsubscribe();
  }, [companyId]);

  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
