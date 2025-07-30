import { db, auth } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { sendPushNotification } from "./notificationService";

// --- Session Snapshot Listeners ---
export const getAvailableSessionsSnapshot = async (mentorId, callback) => {
  const q = query(
    collection(db, "sessions"),
    where("mentorId", "==", mentorId),
    where("isBooked", "==", false),
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(sessions);
    },
    (error) => {
      console.error("Snapshot error:", error);
      callback([]);
    },
  );
  return unsubscribe;
};

export const getBookedSessionsSnapshot = async (mentorId, callback) => {
  const q = query(
    collection(db, "bookedSessions"),
    where("mentorId", "==", mentorId),
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(sessions);
    },
    (error) => {
      console.error("Snapshot error:", error);
      callback([]);
    },
  );
  return unsubscribe;
};

// --- Session CRUD Operations ---
export async function getAvailableSessions(mentorId) {
  const q = query(
    collection(db, "sessions"),
    where("mentorId", "==", mentorId),
    where("isBooked", "==", false),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getBookedSessions(mentorId) {
  const q = query(
    collection(db, "bookedSessions"),
    where("mentorId", "==", mentorId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addSession(session, mentorId) {
  const sessionData = {
    ...session,
    mentorId: mentorId,
    isBooked: false,
    status: session.status || "Pending",
    title: session.title || `Session on ${session.date}`,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, "sessions"), sessionData);
  return { id: docRef.id, ...sessionData };
}

export async function updateSession(sessionId, updates) {
  const validStatuses = ["Pending", "Confirmed", "Cancelled"];
  const sessionData = {
    ...updates,
    status: validStatuses.includes(updates.status) ? updates.status : "Pending",
  };
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, sessionData);
  return { id: sessionId, ...sessionData };
}

export async function deleteSession(sessionId) {
  const sessionRef = doc(db, "sessions", sessionId);
  const bookedSessionRef = doc(db, "bookedSessions", sessionId);

  try {
    // Delete session
    await deleteDoc(sessionRef);

    // Delete booked session if exists
    const bookedSessionDoc = await getDoc(bookedSessionRef);
    if (bookedSessionDoc.exists()) {
      await deleteDoc(bookedSessionRef);
    }

    // Delete all related session requests
    const requestsQuery = query(
      collection(db, "sessionRequests"),
      where("sessionId", "==", sessionId),
    );
    const requestsSnapshot = await getDocs(requestsQuery);
    for (const docSnap of requestsSnapshot.docs) {
      await deleteDoc(doc(db, "sessionRequests", docSnap.id));
    }

    // Delete all related notifications
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("relatedId", "==", sessionId),
    );
    const notificationsSnapshot = await getDocs(notificationsQuery);
    for (const docSnap of notificationsSnapshot.docs) {
      await deleteDoc(doc(db, "notifications", docSnap.id));
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}

export async function bookSession(sessionId, freelancerId, title) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, { isBooked: true });

  const bookedSession = {
    sessionId,
    freelancerId,
    mentorId: currentUser.uid,
    title,
    date: new Date().toISOString(),
    status: "Pending",
    createdAt: new Date().toISOString(),
    zoomLink: "https://zoom.us/j/your-zoom-id",
    googleMeetLink: "https://meet.google.com/your-meet-id",
  };

  await addDoc(collection(db, "bookedSessions"), bookedSession);

  const notification = {
    recipientId: freelancerId,
    sessionId,
    mentorId: currentUser.uid,
    message: `Freelancer ${freelancerId} requested to book your session`,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, "notifications"), notification);
}

export const getAvailableSessionsForCommunity = async () => {
  const q = query(collection(db, "sessions"), where("isBooked", "==", false));
  const snapshot = await getDocs(q);
  const sessions = [];
  for (const docSnap of snapshot.docs) {
    const sessionData = { id: docSnap.id, ...docSnap.data() };
    const mentorDoc = await getDoc(doc(db, "users", sessionData.mentorId));
    sessionData.mentorName = mentorDoc.exists()
      ? mentorDoc.data().name || "Mentor"
      : "Mentor";
    sessions.push(sessionData);
  }
  return sessions;
};

export const enrichSessions = async (sessions) => {
  return await Promise.all(
    sessions.map(async (session) => {
      try {
        const mentorDoc = await getDoc(doc(db, "users", session.mentorId));
        return {
          ...session,
          mentorName: mentorDoc.exists()
            ? mentorDoc.data().name
            : "Unknown Mentor",
        };
      } catch (e) {
        return session;
      }
    }),
  );
};

// --- Session Request CRUD Operations ---
export const createSessionRequest = async (
  sessionId,
  mentorId,
  menteeId,
  menteeName,
  menteeTitle,
) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("sessionId", "==", sessionId),
      where("menteeId", "==", menteeId),
      where("status", "==", "pending"),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error("You have already submitted a request for this session.");
    }

    const requestData = {
      sessionId,
      mentorId,
      menteeId,
      menteeName,
      menteeTitle,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const requestRef = await addDoc(
      collection(db, "sessionRequests"),
      requestData,
    );
    return requestRef.id;
  } catch (error) {
    console.error("Error creating session request:", error);
    throw error;
  }
};

export const getSessionRequestsForMentor = async (mentorId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("mentorId", "==", mentorId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting session requests for mentor:", error);
    throw error;
  }
};

export const getSessionRequestsForSession = async (sessionId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("sessionId", "==", sessionId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting session requests for session:", error);
    throw error;
  }
};

export const acceptSessionRequest = async (requestId, sessionId) => {
  const requestRef = doc(db, "sessionRequests", requestId);
  const sessionRef = doc(db, "sessions", sessionId);
  const bookedSessionRef = doc(db, "bookedSessions", sessionId);

  try {
    const requestData = (await getDoc(requestRef)).data();
    const sessionData = (await getDoc(sessionRef)).data();

    await updateDoc(sessionRef, {
      isBooked: true,
      bookedBy: requestData.menteeId,
      status: "Confirmed",
      updatedAt: serverTimestamp(),
    });

    const bookedSessionData = {
      sessionId,
      freelancerId: requestData.menteeId,
      mentorId: requestData.mentorId,
      title: sessionData.title,
      date: sessionData.date || new Date().toISOString(),
      status: "Confirmed",
      zoomLink: "https://zoom.us/j/your-zoom-id",
      googleMeetLink: "https://meet.google.com/your-meet-id",
      updatedAt: serverTimestamp(),
    };
    await setDoc(bookedSessionRef, bookedSessionData, { merge: true });

    const acceptedNotification = {
      recipientId: requestData.menteeId,
      senderId: requestData.mentorId,
      type: "session_accepted",
      message: `Your request for session "${sessionData.title}" has been accepted!`,
      relatedId: sessionId,
      read: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "notifications"), acceptedNotification);

    const menteeDoc = await getDoc(doc(db, "users", requestData.menteeId));
    const menteeFcmToken = menteeDoc.data()?.fcmToken;
    if (menteeFcmToken) {
      await sendPushNotification({
        token: menteeFcmToken,
        title: "Session Status Update",
        body: `Your request for session "${sessionData.title}" has been accepted!`,
        data: { url: `/session/${sessionId}` },
      });
    }

    const otherRequests = await getSessionRequestsForSession(sessionId);
    const pendingRequests = otherRequests.filter(
      (req) => req.id !== requestId && req.status === "pending",
    );
    for (const req of pendingRequests) {
      await deleteDoc(doc(db, "sessionRequests", req.id));
      const rejectedNotification = {
        recipientId: req.menteeId,
        senderId: requestData.mentorId,
        type: "session_rejected",
        message: `Sorry, the session "${sessionData.title}" was booked by another user.`,
        relatedId: sessionId,
        read: false,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "notifications"), rejectedNotification);

      const rejectedMenteeDoc = await getDoc(doc(db, "users", req.menteeId));
      const rejectedFcmToken = rejectedMenteeDoc.data()?.fcmToken;
      if (rejectedFcmToken) {
        await sendPushNotification({
          token: rejectedFcmToken,
          title: "Session Status Update",
          body: `Sorry, the session "${sessionData.title}" was booked by another user.`,
          data: { url: `/session/${sessionId}` },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error accepting session request:", error);
    throw error;
  }
};

export const rejectSessionRequest = async (requestId) => {
  const requestRef = doc(db, "sessionRequests", requestId);
  try {
    const requestData = (await getDoc(requestRef)).data();
    await deleteDoc(requestRef);
    const notification = {
      recipientId: requestData.menteeId,
      senderId: requestData.mentorId,
      type: "session_rejected",
      message: `Sorry, your request for the session has been rejected.`,
      relatedId: requestData.sessionId,
      read: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "notifications"), notification);

    const menteeDoc = await getDoc(doc(db, "users", requestData.menteeId));
    const fcmToken = menteeDoc.data()?.fcmToken;
    if (fcmToken) {
      await sendPushNotification({
        token: fcmToken,
        title: "Session Status Update",
        body: `Sorry, your request for the session has been rejected.`,
        data: { url: `/session/${requestData.sessionId}` },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error rejecting session request:", error);
    throw error;
  }
};

export const getPendingRequestsCountForSession = async (sessionId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("sessionId", "==", sessionId),
      where("status", "==", "pending"),
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting pending requests count:", error);
    return 0;
  }
};

export const withdrawSessionRequest = async (requestId, userId) => {
  if (!requestId || !userId) {
    throw new Error("Invalid requestId or userId.");
  }
  const requestRef = doc(db, "sessionRequests", requestId);
  try {
    const requestData = await getDoc(requestRef);
    if (!requestData.exists()) {
      throw new Error("Request not found.");
    }
    const request = requestData.data();
    if (request.menteeId !== userId) {
      throw new Error("You are not authorized to withdraw this request.");
    }
    if (request.status !== "pending") {
      throw new Error("Request cannot be withdrawn because it is not pending.");
    }
    await deleteDoc(requestRef);
    return { success: true };
  } catch (error) {
    console.error("Error withdrawing session request:", error);
    throw error;
  }
};

export const cancelSession = async (sessionId, mentorId, menteeId) => {
  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("Invalid session ID provided.");
  }

  try {
    const bookedSessionRef = doc(db, "bookedSessions", sessionId);
    const bookedSessionDoc = await getDoc(bookedSessionRef);
    if (!bookedSessionDoc.exists()) {
      throw new Error("Booked session not found.");
    }

    const sessionData = bookedSessionDoc.data();
    if (sessionData.mentorId !== mentorId) {
      throw new Error("You are not authorized to cancel this session.");
    }

    await deleteDoc(bookedSessionRef);

    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, {
      isBooked: false,
      bookedBy: null,
      status: "Pending",
      updatedAt: serverTimestamp(),
    });

    const requestsSnapshot = await getDocs(
      query(
        collection(db, "sessionRequests"),
        where("sessionId", "==", sessionId),
      ),
    );
    for (const docSnap of requestsSnapshot.docs) {
      await deleteDoc(doc(db, "sessionRequests", docSnap.id));
    }

    if (menteeId) {
      const allNotifsQuery = query(
        collection(db, "notifications"),
        where("relatedId", "==", sessionId),
      );
      const notifsSnapshot = await getDocs(allNotifsQuery);
      for (const docSnap of notifsSnapshot.docs) {
        await deleteDoc(doc(db, "notifications", docSnap.id));
      }

      const cancellationNotif = {
        recipientId: menteeId,
        senderId: mentorId,
        type: "session_cancelled",
        message: `The session has been cancelled by the mentor.`,
        relatedId: sessionId,
        read: false,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "notifications"), cancellationNotif);

      const menteeDoc = await getDoc(doc(db, "users", menteeId));
      const fcmToken = menteeDoc.data()?.fcmToken;
      if (fcmToken) {
        await sendPushNotification({
          token: fcmToken,
          title: "Session Cancelled",
          body: "The session has been cancelled by the mentor.",
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling session:", error);
    throw error;
  }
};
