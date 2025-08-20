// // src/services/notificationService.js
// import { db } from "@/config/firebase";
// import {
//   collection,
//   doc,
//   updateDoc,
//   addDoc,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   deleteDoc,
// } from "firebase/firestore";
// import { getMessaging } from "firebase/messaging";
// import { getAuth } from "firebase/auth";

// // ---- Push Notification ----
// export async function sendPushNotification({ token, title, body, data }) {
//   try {
//     const response = await fetch("/api/notify", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token, title, body, data }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       console.log("✅ Push notification sent successfully");
//     } else {
//       console.error("❌ FCM Error:", result.error);
//     }
//     return result;
//   } catch (error) {
//     console.error("❌ Error sending push notification:", error);
//     return { success: false, error: error.message };
//   }
// }

// // ---- Notification ----
// export async function getAllNotifications() {
//   const snapshot = await getDocs(collection(db, "notifications"));

//   // Helper function to convert Timestamp to ISO string
//   const convertTimestamp = (timestamp) => {
//     if (timestamp?.toDate && typeof timestamp.toDate === "function") {
//       return timestamp.toDate().toISOString();
//     } else if (timestamp?.seconds) {
//       // Handle Timestamp objects without toDate method
//       return new Date(timestamp.seconds * 1000).toISOString();
//     } else if (typeof timestamp === "string") {
//       return timestamp;
//     }
//     return timestamp;
//   };

//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       ...data,
//       createdAt: convertTimestamp(data.createdAt),
//       updatedAt: convertTimestamp(data.updatedAt),
//       readAt: convertTimestamp(data.readAt),
//     };
//   });
// }

// export function listenToNotifications(userId, callback) {
//   const q = query(
//     collection(db, "notifications"),
//     where("recipientId", "==", userId),
//     orderBy("createdAt", "desc")
//   );
//   return onSnapshot(q, (snapshot) => {
//     // Helper function to convert Timestamp to ISO string
//     const convertTimestamp = (timestamp) => {
//       if (timestamp?.toDate && typeof timestamp.toDate === "function") {
//         return timestamp.toDate().toISOString();
//       } else if (timestamp?.seconds) {
//         // Handle Timestamp objects without toDate method
//         return new Date(timestamp.seconds * 1000).toISOString();
//       } else if (typeof timestamp === "string") {
//         return timestamp;
//       }
//       return timestamp;
//     };

//     const notifications = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         createdAt: convertTimestamp(data.createdAt),
//         updatedAt: convertTimestamp(data.updatedAt),
//         readAt: convertTimestamp(data.readAt),
//       };
//     });
//     callback(notifications);
//   });
// }

// export async function updateNotification(notificationId, updates) {
//   const notificationRef = doc(db, "notifications", notificationId);
//   await updateDoc(notificationRef, updates);
// }

// export async function deleteNotification(notificationId) {
//   await deleteDoc(doc(db, "notifications", notificationId));
//   return { id: notificationId };
// }

// // ✅ Mark notification as read
// export async function markNotificationAsRead(notificationId) {
//   try {
//     const notificationRef = doc(db, "notifications", notificationId);
//     await updateDoc(notificationRef, { read: true });
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//   }
// }

// // --- New Function to Delete Old Notifications ---
// export async function deleteOldNotifications(userId) {
//   try {
//     const tenDaysAgo = new Date();
//     tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // الحصول على التاريخ قبل 10 أيام
//     const q = query(
//       collection(db, "notifications"),
//       where("recipientId", "==", userId),
//       where("createdAt", "<", tenDaysAgo)
//     );
//     const snapshot = await getDocs(q);
//     const deletePromises = snapshot.docs.map((docSnap) =>
//       deleteDoc(doc(db, "notifications", docSnap.id))
//     );
//     await Promise.all(deletePromises);
//     // console.log(`Deleted ${deletePromises.length} old notifications for user ${userId}`);
//   } catch (error) {
//     console.error("Error deleting old notifications:", error);
//   }
// }
// //////////////////////////////
// // // src/services/notificationService.js
// // import { db } from "@/config/firebase";
// // import {
// //   collection,
// //   doc,
// //   updateDoc,
// //   addDoc,
// //   onSnapshot,
// //   query,
// //   where,
// //   orderBy,
// //   getDocs,
// //   getDoc,
// //   deleteDoc,
// // } from "firebase/firestore";
// // import { getMessaging } from "firebase/messaging";
// // import { getAuth } from "firebase/auth";

// // // ---- Push Notification ----

// // export async function sendPushNotification({ token, title, body, data }) {
// //   try {
// //     const response = await fetch("/api/notify", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ token, title, body, data }),
// //     });

// //     const result = await response.json();
// //     if (result.success) {
// //       console.log("✅ Push notification sent successfully");
// //     } else {
// //       console.error("❌ FCM Error:", result.error);
// //     }
// //     return result;
// //   } catch (error) {
// //     console.error("❌ Error sending push notification:", error);
// //     return { success: false, error: error.message };
// //   }
// // }

// // // ---- New Function for Job Application Notifications (One per Job, Updating Count) ----

// // export async function sendJobApplicationNotification(companyId, jobId, jobTitle) {
// //   try {
// //     const notifQuery = query(
// //       collection(db, "notifications"),
// //       where("recipientId", "==", companyId),
// //       where("jobId", "==", jobId),
// //       where("type", "==", "job_applications")
// //     );

// //     const snapshot = await getDocs(notifQuery);
// //     let newCount = 1;
// //     let notificationId;

// //     if (snapshot.empty) {
// //       // Create new notification if none exists
// //       const newNotif = await addDoc(collection(db, "notifications"), {
// //         recipientId: companyId,
// //         type: "job_applications",
// //         title: `Applications for ${jobTitle}`,
// //         body: `${newCount} user has applied to your job.`,
// //         count: newCount,
// //         jobId,
// //         createdAt: new Date(),
// //         updatedAt: new Date(),
// //         read: false,
// //       });
// //       notificationId = newNotif.id;
// //     } else {
// //       // Update existing notification
// //       const notifDoc = snapshot.docs[0];
// //       const currentCount = notifDoc.data().count || 0;
// //       newCount = currentCount + 1;
// //       await updateDoc(notifDoc.ref, {
// //         body: `${newCount} users have applied to your job.`,
// //         count: newCount,
// //         updatedAt: new Date(),
// //         read: false, // Reset to unread to highlight update
// //       });
// //       notificationId = notifDoc.id;
// //     }

// //     // Fetch company's FCM token and send push notification
// //     const companyRef = doc(db, "users", companyId);
// //     const companySnap = await getDoc(companyRef);
// //     const fcmToken = companySnap.data()?.fcmToken;

// //     if (fcmToken) {
// //       await sendPushNotification({
// //         token: fcmToken,
// //         title: `Update on ${jobTitle}`,
// //         body: `You now have ${newCount} applications.`,
// //         data: { jobId, type: "job_applications" }, // Optional data for navigation
// //       });
// //     }

// //     console.log("✅ Job application notification handled successfully");
// //   } catch (error) {
// //     console.error("❌ Error handling job application notification:", error);
// //   }
// // }

// // // ---- Notification Listening ----

// // export function listenToNotifications(userId, callback) {
// //   const q = query(
// //     collection(db, "notifications"),
// //     where("recipientId", "==", userId),
// //     orderBy("createdAt", "desc"),
// //   );
// //   return onSnapshot(q, (snapshot) => {
// //     const notifications = snapshot.docs.map((doc) => ({
// //       id: doc.id,
// //       ...doc.data(),
// //     }));
// //     callback(notifications);
// //   });
// // }

// // export async function updateNotification(notificationId, updates) {
// //   const notificationRef = doc(db, "notifications", notificationId);
// //   await updateDoc(notificationRef, updates);
// // }

// // // --- New Function to Delete Old Notifications ---
// // export async function deleteOldNotifications(userId) {
// //   try {
// //     const tenDaysAgo = new Date();
// //     tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // الحصول على التاريخ قبل 10 أيام
// //     const q = query(
// //       collection(db, "notifications"),
// //       where("recipientId", "==", userId),
// //       where("createdAt", "<", tenDaysAgo),
// //     );
// //     const snapshot = await getDocs(q);
// //     const deletePromises = snapshot.docs.map((docSnap) =>
// //       deleteDoc(doc(db, "notifications", docSnap.id)),
// //     );
// //     await Promise.all(deletePromises);
// //     // console.log(
// //     //   `Deleted ${deletePromises.length} old notifications for user ${userId}`,
// //     // );
// //   } catch (error) {
// //     console.error("Error deleting old notifications:", error);
// //   }
// // }
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

// ---- Push Notification ----
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
      // console.log("✅ Push notification sent successfully");
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

  // Helper function to convert Timestamp to ISO string
  const convertTimestamp = (timestamp) => {
    if (timestamp?.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toISOString();
    } else if (timestamp?.seconds) {
      // Handle Timestamp objects without toDate method
      return new Date(timestamp.seconds * 1000).toISOString();
    } else if (typeof timestamp === "string") {
      return timestamp;
    }
    return timestamp;
  };

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
      readAt: convertTimestamp(data.readAt),
    };
  });
}

export function listenToNotifications(userId, callback) {
  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(q, (snapshot) => {
    // Helper function to convert Timestamp to ISO string
    const convertTimestamp = (timestamp) => {
      if (timestamp?.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toISOString();
      } else if (timestamp?.seconds) {
        // Handle Timestamp objects without toDate method
        return new Date(timestamp.seconds * 1000).toISOString();
      } else if (typeof timestamp === "string") {
        return timestamp;
      }
      return timestamp;
    };

    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        readAt: convertTimestamp(data.readAt),
      };
    });
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

// ✅ Mark notification as read
export async function markNotificationAsRead(notificationId) {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
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
    // console.log(`Deleted ${deletePromises.length} old notifications for user ${userId}`);
  } catch (error) {
    console.error("Error deleting old notifications:", error);
  }
}

// --- New Function to Send Job Application Notification ---
export async function sendJobApplicationNotification(
  companyId,
  jobId,
  jobTitle,
) {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", companyId),
      where("jobId", "==", jobId),
      where("type", "==", "job_application"),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Update existing notification
      const notificationDoc = snapshot.docs[0];
      const currentCount = notificationDoc.data().applicantCount || 0;
      await updateDoc(doc(db, "notifications", notificationDoc.id), {
        applicantCount: currentCount + 1,
        updatedAt: new Date(),
      });
    } else {
      // Create new notification
      await addDoc(notificationsRef, {
        recipientId: companyId,
        jobId,
        type: "job_application",
        title: `New Application for ${jobTitle}`,
        body: `A new candidate has applied for your job: ${jobTitle}.`,
        applicantCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        read: false,
      });
    }
  } catch (error) {
    console.error("Error sending job application notification:", error);
  }
}

// --- New Function to Mark All Notifications as Read ---
export async function markAllNotificationsAsRead(userId) {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", userId),
      where("read", "==", false),
    );
    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, "notifications", docSnap.id), {
        read: true,
        readAt: new Date(),
      }),
    );
    await Promise.all(updatePromises);
    // console.log(
    //   `Marked ${updatePromises.length} notifications as read for user ${userId}`,
    // );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
}

// --- New Function to Get Unread Notifications Count ---
export async function getUnreadNotificationsCount(userId) {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", userId),
      where("read", "==", false),
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unread notifications count:", error);
    return 0;
  }
}

// --- Helper: Resolve navigation target for a notification ---
export function getNotificationTarget(notification) {
  if (!notification || typeof notification !== "object") return null;

  const type = notification.type;
  const relatedId = notification.relatedId;

  switch (type) {
    // Community/Post related
    case "like":
    case "comment":
    case "comment_mention": {
      if (relatedId) return `/community/${relatedId}`;
      return "/community";
    }

    // Sessions related
    case "session_accepted":
    case "session_rejected":
    case "session_cancelled": {
      if (relatedId) return `/session/${relatedId}`;
      return "/mentor/sessions";
    }

    // Jobs related
    case "job_application": {
      // Some job notifications store jobId explicitly
      if (notification.jobId) return `/Applicationjob/${notification.jobId}`;
      if (relatedId) return `/Applicationjob/${relatedId}`;
      return "/companyjobs";
    }
    case "job_posted": {
      return "/companyjobs";
    }

    // Account/Admin related
    case "registration":
    case "incomplete_profile":
    case "profile_under_review":
    case "account_approved":
    case "profile_approved":
    case "account_rejected":
    case "profile_rejected":
    case "account_suspended": {
      return null; // handled specially by callers (toasts, logout, etc.)
    }

    default:
      return null;
  }
}
