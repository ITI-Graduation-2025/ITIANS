// import { db, auth } from "@/config/firebase";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   serverTimestamp,
//   onSnapshot,
//   query,
//   orderBy,
//   where,
// } from "firebase/firestore";
// import { getMessaging, getToken } from "firebase/messaging";

// // --- User CRUD Operations ---

// export const setUser = async (uid, data) => {
//   await setDoc(doc(db, "users", uid), { ...data });
// };

// export const getUser = async (uid) => {
//   const userRef = doc(db, "users", uid);
//   const snapshot = await getDoc(userRef);
//   if (snapshot.exists()) {
//     const userData = { id: snapshot.id, ...snapshot.data() };
//     if (userData.createdAt && typeof userData.createdAt.toDate === "function") {
//       userData.createdAt = userData.createdAt.toDate().toISOString();
//     }
//     return userData;
//   }
//   return "User not found";
// };

// export const updateUser = async (uid, data) => {
//   await updateDoc(doc(db, "users", uid), data);
// };

// export const getAllUsers = async () => {
//   const snapshot = await getDocs(collection(db, "users"));
//   return snapshot.docs.map((doc) => {
//     const data = doc.data();
//     let createdAt = null;
//     if (data.createdAt?.toDate) {
//       createdAt = data.createdAt.toDate().toISOString();
//     } else if (typeof data.createdAt === "string") {
//       createdAt = data.createdAt;
//     }
//     return { id: doc.id, ...data, createdAt };
//   });
// };

// export const subscribeToUsers = (callback) => {
//   return onSnapshot(collection(db, "users"), (snapshot) => {
//     const users = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       let createdAt = null;
//       if (data.createdAt?.toDate) {
//         createdAt = data.createdAt.toDate().toISOString();
//       } else if (typeof data.createdAt === "string") {
//         createdAt = data.createdAt;
//       }
//       return { id: doc.id, ...data, createdAt };
//     });
//     callback(users);
//   });
// };

// // --- Company Account Logic ---

// export const setCompany = async (email, data) => {
//   await setDoc(doc(db, "companyAccount", email), {
//     ...data,
//     createdAt: serverTimestamp(),
//     verificationStatus: "Pending",
//     rating: 0,
//     reviews: 0,
//     stats: { activeJobs: 0, totalHires: 0, successRate: "0%" },
//     specializations: [],
//   });
// };

// // --- Session CRUD Operations ---

// export async function getAvailableSessions(mentorId) {
//   const q = query(
//     collection(db, "sessions"),
//     where("mentorId", "==", mentorId),
//   );
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// export async function getBookedSessions(mentorId) {
//   const q = query(
//     collection(db, "bookedSessions"),
//     where("mentorId", "==", mentorId),
//   );
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// }

// export async function addSession(session, mentorId) {
//   const sessionData = {
//     ...session,
//     mentorId: mentorId,
//     isBooked: false,
//     status: session.status || "Pending",
//     title: session.title || `Session on ${session.date}`,
//     createdAt: new Date().toISOString(),
//   };
//   const docRef = await addDoc(collection(db, "sessions"), sessionData);
//   return { id: docRef.id, ...sessionData };
// }

// export async function updateSession(sessionId, updates) {
//   const validStatuses = ["Pending", "Confirmed", "Cancelled"];
//   const sessionData = {
//     ...updates,
//     status: validStatuses.includes(updates.status) ? updates.status : "Pending",
//   };
//   const sessionRef = doc(db, "sessions", sessionId);
//   await updateDoc(sessionRef, sessionData);
//   return { id: sessionId, ...sessionData };
// }

// export async function deleteSession(sessionId) {
//   await deleteDoc(doc(db, "sessions", sessionId));
// }

// export async function bookSession(sessionId, freelancerId, title) {
//   const currentUser = auth.currentUser;
//   if (!currentUser) throw new Error("User not authenticated");

//   const sessionRef = doc(db, "sessions", sessionId);
//   await updateDoc(sessionRef, { isBooked: true });

//   const bookedSession = {
//     sessionId,
//     freelancerId,
//     mentorId: currentUser.uid,
//     title,
//     date: new Date().toISOString(),
//     status: "Pending",
//     createdAt: new Date().toISOString(),
//     zoomLink: "https://zoom.us/j/your-zoom-id", // Replace with dynamic link
//     googleMeetLink: "https://meet.google.com/your-meet-id", // Replace with dynamic link
//   };

//   await addDoc(collection(db, "bookedSessions"), bookedSession);

//   const notification = {
//     recipientId: freelancerId,
//     sessionId,
//     mentorId: currentUser.uid,
//     message: `Freelancer ${freelancerId} requested to book your session`,
//     status: "Pending",
//     createdAt: new Date().toISOString(),
//   };

//   await addDoc(collection(db, "notifications"), notification);
// }

// // --- Notification Operations ---

// export function listenToNotifications(userId, callback) {
//   const q = query(
//     collection(db, "notifications"),
//     where("recipientId", "==", userId),
//     orderBy("createdAt", "desc"),
//   );
//   return onSnapshot(q, (snapshot) => {
//     const notifications = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(notifications);
//   });
// }

// export async function updateNotification(notificationId, updates) {
//   const notificationRef = doc(db, "notifications", notificationId);
//   await updateDoc(notificationRef, updates);
// }

// // --- Session Request CRUD Operations ---

// export const createSessionRequest = async (
//   sessionId,
//   mentorId,
//   menteeId,
//   menteeName,
//   menteeTitle,
// ) => {
//   try {
//     const q = query(
//       collection(db, "sessionRequests"),
//       where("sessionId", "==", sessionId),
//       where("menteeId", "==", menteeId),
//       where("status", "==", "pending"),
//     );
//     const snapshot = await getDocs(q);
//     if (!snapshot.empty) {
//       throw new Error("You have already submitted a request for this session.");
//     }

//     const requestData = {
//       sessionId,
//       mentorId,
//       menteeId,
//       menteeName,
//       menteeTitle,
//       status: "pending",
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     };
//     const requestRef = await addDoc(
//       collection(db, "sessionRequests"),
//       requestData,
//     );
//     return requestRef.id;
//   } catch (error) {
//     console.error("Error creating session request:", error);
//     throw error;
//   }
// };

// export const getSessionRequestsForMentor = async (mentorId) => {
//   try {
//     const q = query(
//       collection(db, "sessionRequests"),
//       where("mentorId", "==", mentorId),
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error("Error getting session requests for mentor:", error);
//     throw error;
//   }
// };

// export const getSessionRequestsForSession = async (sessionId) => {
//   try {
//     const q = query(
//       collection(db, "sessionRequests"),
//       where("sessionId", "==", sessionId),
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error("Error getting session requests for session:", error);
//     throw error;
//   }
// };

// export const acceptSessionRequest = async (requestId, sessionId) => {
//   const requestRef = doc(db, "sessionRequests", requestId);
//   const sessionRef = doc(db, "sessions", sessionId);
//   const bookedSessionRef = doc(db, "bookedSessions", sessionId);

//   try {
//     // Get request and session data
//     const requestData = (await getDoc(requestRef)).data();
//     const sessionData = (await getDoc(sessionRef)).data();

//     // Verify mentor authentication
//     // const currentUser = auth.currentUser;
//     // if (!currentUser || currentUser.uid !== requestData.mentorId) {
//     //   throw new Error("Only the mentor can confirm this session.");
//     // }

//     // Update session to Confirmed
//     await updateDoc(sessionRef, {
//       isBooked: true,
//       bookedBy: requestData.menteeId,
//       status: "Confirmed",
//       updatedAt: serverTimestamp(),
//     });

//     // Update or create booked session with meeting links
//     const bookedSessionData = {
//       sessionId,
//       freelancerId: requestData.menteeId,
//       mentorId: requestData.mentorId,
//       title: sessionData.title,
//       date: sessionData.date || new Date().toISOString(),
//       status: "Confirmed",
//       zoomLink: "https://zoom.us/j/your-zoom-id", // Replace with dynamic link
//       googleMeetLink: "https://meet.google.com/your-meet-id", // Replace with dynamic link
//       updatedAt: serverTimestamp(),
//     };
//     await setDoc(bookedSessionRef, bookedSessionData, { merge: true });

//     // Send notification to accepted mentee
//     const acceptedNotification = {
//       recipientId: requestData.menteeId,
//       senderId: requestData.mentorId,
//       type: "session_accepted",
//       message: `Your request for session "${sessionData.title}" has been accepted!`,
//       relatedId: sessionId,
//       read: false,
//       createdAt: serverTimestamp(),
//     };
//     await addDoc(collection(db, "notifications"), acceptedNotification);

//     // Send push notification to accepted mentee
//     const menteeDoc = await getDoc(doc(db, "users", requestData.menteeId));
//     const menteeFcmToken = menteeDoc.data()?.fcmToken;
//     if (menteeFcmToken) {
//       await sendPushNotification({
//         token: menteeFcmToken,
//         title: "Session Status Update",
//         body: `Your request for session "${sessionData.title}" has been accepted!`,
//         data: { url: `/session/${sessionId}` },
//       });
//     }

//     // Delete other pending requests
//     const otherRequests = await getSessionRequestsForSession(sessionId);
//     const pendingRequests = otherRequests.filter(
//       (req) => req.id !== requestId && req.status === "pending",
//     );
//     for (const req of pendingRequests) {
//       await deleteDoc(doc(db, "sessionRequests", req.id));
//       const rejectedNotification = {
//         recipientId: req.menteeId,
//         senderId: requestData.mentorId,
//         type: "session_rejected",
//         message: `Sorry, the session "${sessionData.title}" was booked by another user.`,
//         relatedId: sessionId,
//         read: false,
//         createdAt: serverTimestamp(),
//       };
//       await addDoc(collection(db, "notifications"), rejectedNotification);

//       const rejectedMenteeDoc = await getDoc(doc(db, "users", req.menteeId));
//       const rejectedFcmToken = rejectedMenteeDoc.data()?.fcmToken;
//       if (rejectedFcmToken) {
//         await sendPushNotification({
//           token: rejectedFcmToken,
//           title: "Session Status Update",
//           body: `Sorry, the session "${sessionData.title}" was booked by another user.`,
//           data: { url: `/session/${sessionId}` },
//         });
//       }
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error accepting session request:", error);
//     throw error;
//   }
// };

// export const rejectSessionRequest = async (requestId) => {
//   const requestRef = doc(db, "sessionRequests", requestId);
//   try {
//     const requestData = (await getDoc(requestRef)).data();
//     await deleteDoc(requestRef);
//     const notification = {
//       recipientId: requestData.menteeId,
//       senderId: requestData.mentorId,
//       type: "session_rejected",
//       message: `Sorry, your request for the session has been rejected.`,
//       relatedId: requestData.sessionId,
//       read: false,
//       createdAt: serverTimestamp(),
//     };
//     await addDoc(collection(db, "notifications"), notification);

//     const menteeDoc = await getDoc(doc(db, "users", requestData.menteeId));
//     const fcmToken = menteeDoc.data()?.fcmToken;
//     if (fcmToken) {
//       await sendPushNotification({
//         token: fcmToken,
//         title: "Session Status Update",
//         body: `Sorry, your request for the session has been rejected.`,
//         data: { url: `/session/${requestData.sessionId}` },
//       });
//     }
//     return { success: true };
//   } catch (error) {
//     console.error("Error rejecting session request:", error);
//     throw error;
//   }
// };

// export const getPendingRequestsCountForSession = async (sessionId) => {
//   try {
//     const q = query(
//       collection(db, "sessionRequests"),
//       where("sessionId", "==", sessionId),
//       where("status", "==", "pending"),
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.size;
//   } catch (error) {
//     console.error("Error getting pending requests count:", error);
//     return 0;
//   }
// };

// export const withdrawSessionRequest = async (requestId, userId) => {
//   if (!requestId || !userId) {
//     throw new Error("Invalid requestId or userId.");
//   }
//   const requestRef = doc(db, "sessionRequests", requestId);
//   try {
//     const requestData = await getDoc(requestRef);
//     if (!requestData.exists()) {
//       throw new Error("Request not found.");
//     }
//     const request = requestData.data();
//     if (request.menteeId !== userId) {
//       throw new Error("You are not authorized to withdraw this request.");
//     }
//     if (request.status !== "pending") {
//       throw new Error("Request cannot be withdrawn because it is not pending.");
//     }
//     await deleteDoc(requestRef);
//     return { success: true };
//   } catch (error) {
//     console.error("Error withdrawing session request:", error);
//     throw error;
//   }
// };

// export const getAvailableSessionsForCommunity = async () => {
//   try {
//     const q = query(collection(db, "sessions"), where("isBooked", "==", false));
//     const snapshot = await getDocs(q);
//     const sessions = [];
//     for (const doc of snapshot.docs) {
//       const sessionData = { id: doc.id, ...doc.data() };
//       const mentorDoc = await getDoc(doc(db, "users", sessionData.mentorId));
//       sessionData.mentorName = mentorDoc.exists()
//         ? mentorDoc.data().name || "Mentor"
//         : "Mentor";
//       sessions.push(sessionData);
//     }
//     return sessions;
//   } catch (error) {
//     console.error("Error getting available sessions:", error);
//     throw error;
//   }
// };

// const enrichSessions = async (sessions) => {
//   return await Promise.all(
//     sessions.map(async (session) => {
//       try {
//         const mentorDoc = await getDoc(doc(db, "users", session.mentorId));
//         return {
//           ...session,
//           mentorName: mentorDoc.exists()
//             ? mentorDoc.data().name
//             : "Unknown Mentor",
//         };
//       } catch (e) {
//         return session;
//       }
//     }),
//   );
// };

// // --- Posts CRUD Operations ---

// export const createPost = async (postData) => {
//   try {
//     const postRef = await addDoc(collection(db, "posts"), {
//       ...postData,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     return { id: postRef.id, ...postData };
//   } catch (error) {
//     console.error("Error creating post:", error);
//     throw error;
//   }
// };

// export const getAllPosts = async () => {
//   try {
//     const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map((doc) => {
//       const data = doc.data();
//       let createdAt = null;
//       let updatedAt = null;

//       if (data.createdAt?.toDate) {
//         createdAt = data.createdAt.toDate().toISOString();
//       } else if (typeof data.createdAt === "string") {
//         createdAt = data.createdAt;
//       }

//       if (data.updatedAt?.toDate) {
//         updatedAt = data.updatedAt.toDate().toISOString();
//       } else if (typeof data.updatedAt === "string") {
//         updatedAt = data.updatedAt;
//       }

//       return {
//         id: doc.id,
//         ...data,
//         createdAt,
//         updatedAt,
//       };
//     });
//   } catch (error) {
//     console.error("Error getting posts:", error);
//     throw error;
//   }
// };

// export const getPost = async (postId) => {
//   try {
//     const postRef = doc(db, "posts", postId);
//     const snapshot = await getDoc(postRef);
//     if (snapshot.exists()) {
//       const data = snapshot.data();
//       let createdAt = null;
//       let updatedAt = null;

//       if (data.createdAt?.toDate) {
//         createdAt = data.createdAt.toDate().toISOString();
//       } else if (typeof data.createdAt === "string") {
//         createdAt = data.createdAt;
//       }

//       if (data.updatedAt?.toDate) {
//         updatedAt = data.updatedAt.toDate().toISOString();
//       } else if (typeof data.updatedAt === "string") {
//         updatedAt = data.updatedAt;
//       }

//       return {
//         id: snapshot.id,
//         ...data,
//         createdAt,
//         updatedAt,
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error("Error getting post:", error);
//     throw error;
//   }
// };

// export const updatePost = async (postId, updateData) => {
//   try {
//     const postRef = doc(db, "posts", postId);
//     await updateDoc(postRef, {
//       ...updateData,
//       updatedAt: serverTimestamp(),
//     });
//     return { id: postId, ...updateData };
//   } catch (error) {
//     console.error("Error updating post:", error);
//     throw error;
//   }
// };

// export const deletePost = async (postId) => {
//   try {
//     await deleteDoc(doc(db, "posts", postId));
//     return { id: postId };
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     throw error;
//   }
// };

// export const subscribeToPosts = (callback) => {
//   const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
//   return onSnapshot(q, (snapshot) => {
//     const posts = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       let createdAt = null;
//       let updatedAt = null;

//       if (data.createdAt?.toDate) {
//         createdAt = data.createdAt.toDate().toISOString();
//       } else if (typeof data.createdAt === "string") {
//         createdAt = data.createdAt;
//       }

//       if (data.updatedAt?.toDate) {
//         updatedAt = data.updatedAt.toDate().toISOString();
//       } else if (typeof data.updatedAt === "string") {
//         updatedAt = data.updatedAt;
//       }

//       return {
//         id: doc.id,
//         ...data,
//         createdAt,
//         updatedAt,
//       };
//     });
//     callback(posts);
//   });
// };

// // Helper function for push notifications
// export async function sendPushNotification({ token, title, body, data }) {
//   const message = {
//     notification: { title, body },
//     webpush: {
//       fcm_options: { link: data.url || "/" },
//     },
//     token,
//   };

//   try {
//     const messaging = getMessaging();
//     const auth = getAuth();
//     const idToken = await auth.currentUser.getIdToken();
//     const response = await fetch(
//       `https://fcm.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/messages:send`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message }),
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`FCM Error: ${errorData.error.message}`);
//     }

//     console.log("Push notification sent successfully");
//     return { success: true };
//   } catch (error) {
//     console.error("Error sending push notification:", error);
//     return { success: false, error: error.message };
//   }
// }

// export const cancelSession = async (sessionId, mentorId, menteeId) => {
//   if (!sessionId || typeof sessionId !== "string") {
//     throw new Error("Invalid session ID provided.");
//   }

//   try {
//     const bookedSessionRef = doc(db, "bookedSessions", sessionId);
//     const bookedSessionDoc = await getDoc(bookedSessionRef);
//     if (!bookedSessionDoc.exists()) {
//       throw new Error("Booked session not found.");
//     }

//     const sessionData = bookedSessionDoc.data();
//     if (sessionData.mentorId !== mentorId) {
//       throw new Error("You are not authorized to cancel this session.");
//     }

//     // 1. Delete from bookedSessions
//     await deleteDoc(bookedSessionRef);

//     // 2. Update original session to make it available again
//     const sessionRef = doc(db, "sessions", sessionId);
//     await updateDoc(sessionRef, {
//       isBooked: false,
//       bookedBy: null,
//       status: "Pending",
//       updatedAt: serverTimestamp(),
//     });

//     // 3. Delete all sessionRequests for this session
//     const requestsSnapshot = await getDocs(
//       query(
//         collection(db, "sessionRequests"),
//         where("sessionId", "==", sessionId),
//       ),
//     );
//     for (const docSnap of requestsSnapshot.docs) {
//       await deleteDoc(doc(db, "sessionRequests", docSnap.id));
//     }

//     // 4. Send cancellation notification to mentee
//     console.log(menteeId);

//     if (menteeId) {
//       const cancellationNotif = {
//         recipientId: menteeId,
//         senderId: mentorId,
//         type: "session_cancelled",
//         message: `The session has been cancelled by the mentor.`,
//         relatedId: sessionId,
//         read: false,
//         createdAt: serverTimestamp(),
//       };
//       await addDoc(collection(db, "notifications"), cancellationNotif);

//       // Delete old acceptance notification
//       const acceptedNotifsQuery = query(
//         collection(db, "notifications"),
//         where("recipientId", "==", menteeId),
//         where("relatedId", "==", sessionId),
//         where("type", "==", "session_accepted"),
//       );
//       const snapshot = await getDocs(acceptedNotifsQuery);
//       for (const docSnap of snapshot.docs) {
//         await deleteDoc(doc(db, "notifications", docSnap.id));
//       }

//       // Push Notification
//       const menteeDoc = await getDoc(doc(db, "users", menteeId));
//       const fcmToken = menteeDoc.data()?.fcmToken;
//       if (fcmToken) {
//         await sendPushNotification({
//           token: fcmToken,
//           title: "Session Cancelled",
//           body: "The session has been cancelled by the mentor.",
//           data: { url: `/session/${sessionId}` },
//         });
//       }
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error cancelling session:", error);
//     throw error;
//   }
// };
