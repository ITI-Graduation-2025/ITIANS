import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging (only in browser environment)
export const messaging =
  typeof window !== "undefined" && "serviceWorker" in navigator
    ? getMessaging(app)
    : null;

// Function to initialize FCM and store token
export async function initializeFCM(userId) {
  if (!messaging) {
    console.warn("Firebase Messaging is not supported in this environment.");
    return null;
  }

  try {
    let registration;
    if ("serviceWorker" in navigator) {
      registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        console.log("Service Worker registered:", registration);
      }
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      await updateDoc(doc(db, "users", userId), {
        fcmToken: currentToken,
        fcmTokenUpdatedAt: new Date().toISOString(),
      });
      console.log("FCM token stored successfully:", currentToken);
      return currentToken;
    } else {
      console.warn("No FCM token available.");
      return null;
    }
  } catch (error) {
    console.error("Error initializing FCM:", error);
    return null;
  }
}
// Function to refresh FCM token
export async function refreshFcmToken(userId) {
  if (!messaging) {
    console.warn("Firebase Messaging is not supported in this environment.");
    return null;
  }

  try {
    // Delete old token
    await deleteToken(messaging);
    console.log("Old FCM token deleted.");

    // Get new token
    const newToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      ),
    });

    if (newToken) {
      // Store new token in Firestore
      await updateDoc(doc(db, "users", userId), {
        fcmToken: newToken,
        fcmTokenUpdatedAt: new Date().toISOString(),
      });
      console.log("FCM token refreshed:", newToken);
      return newToken;
    } else {
      console.warn("No new FCM token available.");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing FCM token:", error);
    return null;
  }
}

// Handle foreground notifications
export function setupForegroundNotifications(callback) {
  if (!messaging) {
    console.warn("Firebase Messaging is not supported in this environment.");
    return () => {};
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Foreground notification received:", payload);
    // Pass notification to callback for in-app handling
    callback(payload);
  });

  return unsubscribe;
}

export default app;
