import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  updateDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";
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

// Initialize Cloud Firestore with improved settings
export const db = getFirestore(app);

// Configure Firestore settings for better network handling
if (typeof window !== "undefined") {
  // Only run in browser environment
  const firestoreSettings = {
    // تقليل عدد الاتصالات المتزامنة
    maxConcurrentConnections: 1,
    // إيقاف الاتصال المستمر
    experimentalForceLongPolling: false,
    // تقليل حجم الكاش
    cacheSizeBytes: 10 * 1024 * 1024, // 10MB فقط
    // إيقاف التحديث التلقائي
    ignoreUndefinedProperties: true,
    // تقليل timeout
    timeoutSeconds: 15,
  };

  // Apply settings if possible
  try {
    if (db.settings) {
      db.settings(firestoreSettings);
    }
  } catch (error) {
    console.warn("Could not apply all Firestore settings:", error);
  }
}

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
        // Service Worker registered successfully
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
      // Store token in Firestore using the existing connection
      await updateDoc(doc(db, "users", userId), {
        fcmToken: currentToken,
        fcmTokenUpdatedAt: new Date().toISOString(),
      });
      console.log("FCM token stored successfully");
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
    // Old FCM token deleted

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
      // FCM token refreshed
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
    // Foreground notification received
    callback(payload);
  });

  return unsubscribe;
}

// Global listener management
let activeListeners = new Set();

// Function to add a listener to tracking
export function addListener(listener) {
  if (listener && typeof listener === "function") {
    activeListeners.add(listener);
    console.log("Listener added, total active:", activeListeners.size);
  }
}

// Function to remove a listener from tracking
export function removeListener(listener) {
  if (activeListeners.has(listener)) {
    activeListeners.delete(listener);
    console.log("Listener removed, total active:", activeListeners.size);
  }
}

// Function to cleanup all active listeners
export function cleanupAllListeners() {
  console.log("Cleaning up", activeListeners.size, "active listeners");
  activeListeners.forEach((listener) => {
    try {
      if (typeof listener === "function") {
        listener();
      }
    } catch (error) {
      console.log("Error cleaning up listener:", error);
    }
  });
  activeListeners.clear();
  console.log("All listeners cleaned up");
}

// Cleanup function for Firestore
export async function cleanupFirestore() {
  try {
    console.log("Starting Firestore cleanup...");
    // تنظيف جميع المستمعين النشطة
    cleanupAllListeners();

    // لا نقوم بإغلاق اتصال Firestore الأساسي لأن NextAuth يحتاجه
    // فقط نقوم بتنظيف المستمعين الداخلية
    console.log("Firestore listeners cleaned up successfully");
  } catch (error) {
    console.log("Firestore cleanup error:", error);
  }
}

export default app;
