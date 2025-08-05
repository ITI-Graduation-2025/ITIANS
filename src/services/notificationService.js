// ✅ src/services/firebase/notificationService.js

import { db } from "@/config/firebase";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";

// ---- Push Notification ----// ✅ src/services/notificationService.js

export async function sendPushNotification({ token, title, body, data }) {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, title, body, data }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("✅ Push notification sent successfully");
    } else {
      console.error("❌ FCM Error:", result.error);
    }
    return result;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    return { success: false, error: error.message };
  }
}
// ---- Notification ----
export async function getAllNotifications() {
  const snapshot = await getDocs(collection(db, "notifications"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export function listenToNotifications(userId, callback) {
  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notifications);
  });
}

export async function updateNotification(notificationId, updates) {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, updates);
}

export async function deleteNotification(notificationId) {
  await deleteDoc(doc(db, "notifications", notificationId));
  return { id: notificationId };
}

// --- New Function to Delete Old Notifications ---
export async function deleteOldNotifications(userId) {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // الحصول على التاريخ قبل 10 أيام
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userId),
      where("createdAt", "<", tenDaysAgo),
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "notifications", docSnap.id)),
    );
    await Promise.all(deletePromises);
    // console.log(
    //   `Deleted ${deletePromises.length} old notifications for user ${userId}`,
    // );
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
}
