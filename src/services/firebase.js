import { db } from "@/config/firebase";
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
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// islam mohamed

// collectionUesr

//  setUser
export const setUser = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
  });
};

//  getUser
export const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const userData = { id: snapshot.id, ...snapshot.data() };
    if (userData.createdAt && typeof userData.createdAt.toDate === "function") {
      userData.createdAt = userData.createdAt.toDate().toISOString();
    }
    return userData;
  }
  return "User not found";
};

//  updateUser
export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

// getAllUsers;
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();

    let createdAt = null;
    if (data.createdAt?.toDate) {
      // لو مكتوب كـ serverTimestamp() في الدوك القديم
      createdAt = data.createdAt.toDate().toISOString();
    } else if (typeof data.createdAt === "string") {
      createdAt = data.createdAt;
    }

    return {
      id: doc.id,
      ...data,
      createdAt,
    };
  });
};

// دي عشان التغير اللحظي لو حصل حاجه في ف الفايربيز بيعمل سناب شوت طول الوقت
// onSnapshot = ابعتلي الداتا أول مرة، وكل مرة تتغير
export const subscribeToUsers = (callback) => {
  return onSnapshot(collection(db, "users"), (snapshot) => {
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();

      let createdAt = null;
      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    callback(users);
  });
};

// companyAccount Logic

// setCompany
export const setCompany = async (email, data) => {
  await setDoc(doc(db, "companyAccount", email), {
    ...data,
    createdAt: serverTimestamp(),
    verificationStatus: "Pending",
    rating: 0,
    reviews: 0,
    stats: {
      activeJobs: 0,
      totalHires: 0,
      successRate: "0%",
    },
    specializations: [],
  });
};

// mentor

export async function getAvailableSessions(mentorId) {
  const q = query(
    collection(db, "sessions"),
    where("mentorId", "==", mentorId),
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
    isBooked: false, // خليها محجوزة عشان تظهر في Booked Sessions
    status: session.status || "Pending", // إضافة status افتراضي
    title: session.title || `Session on ${session.date}`, // إضافة title افتراضي
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "sessions"), sessionData);
  return { id: docRef.id, ...sessionData };
}

export async function updateSession(sessionId, updates) {
  const validStatuses = ["Pending", "Confirmed", "Cancelled"];
  const sessionData = {
    ...updates,
    status: validStatuses.includes(updates.status) ? updates.status : "Pending", // تأكد من الـ status
  };

  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, sessionData);
  return { id: sessionId, ...sessionData };
}

export async function deleteSession(sessionId) {
  await deleteDoc(doc(db, "sessions", sessionId));
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
  };

  const bookedDocRef = await addDoc(
    collection(db, "bookedSessions"),
    bookedSession,
  );

  const notification = {
    freelancerId,
    sessionId,
    mentorId: currentUser.uid,
    message: `Freelancer ${freelancerId} requested to book your session`,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, "notifications"), notification);
}

export function listenToNotifications(mentorId, callback) {
  const q = query(
    collection(db, "notifications"),
    where("mentorId", "==", mentorId),
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

// --- Session Requests CRUD Operations ---

// 1. Create a new session request
export const createSessionRequest = async (
  sessionId,
  mentorId,
  menteeId,
  menteeName,
  menteeTitle,
) => {
  try {
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

    // === إرسال إشعار للموجه ===
    // await createNotification({
    //   recipientId: mentorId, // المستلم هو الموجه
    //   senderId: menteeId, // المرسل هو المتقدم
    //   type: "session_request",
    //   message: `New request for your session on ${requestData.createdAt?.toDate ? requestData.createdAt.toDate().toLocaleDateString() : "N/A"}.`, // رسالة بسيطة، ممكن تحسّنها لاحقًا
    //   relatedId: requestRef.id, // معرف الطلب
    //   read: false,
    //   createdAt: serverTimestamp(),
    // });

    return { id: requestRef.id, ...requestData };
  } catch (error) {
    console.error("Error creating session request:", error);
    throw error;
  }
};

// 2. Get all requests for a specific mentor (for dashboard)
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

// 3. Get all requests for a specific session (for viewing applicants)
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

// 4. Accept a session request
export const acceptSessionRequest = async (requestId, sessionId) => {
  const requestRef = doc(db, "sessionRequests", requestId);
  const sessionRef = doc(db, "sessions", sessionId); // افتراضياً الجلسات في collection اسمه "sessions"

  try {
    // 1. تحديث حالة الطلب إلى "accepted"
    await updateDoc(requestRef, {
      status: "accepted",
      updatedAt: serverTimestamp(),
    });

    // 2. تحديث حالة الجلسة إلى "booked"
    await updateDoc(sessionRef, {
      isBooked: true,
      bookedBy: (await getDoc(requestRef)).data().menteeId, // تخزين معرف المتقدم المقبول
      updatedAt: serverTimestamp(),
      // يمكن إضافة تاريخ الحجز أو أي معلومات إضافية هنا
    });

    // === إرسال إشعار للمتقدم المقبول ===
    const requestData = (await getDoc(requestRef)).data();
    await createNotification({
      recipientId: requestData.menteeId, // المستلم هو المتقدم
      senderId: requestData.mentorId, // المرسل هو الموجه
      type: "session_accepted",
      message: `Your request for the session has been accepted!`, // رسالة تأكيد
      relatedId: sessionId, // معرف الجلسة المحجوزة
      read: false,
      createdAt: serverTimestamp(),
    });

    // 3. رفض الطلبات الأخرى تلقائيًا (اختياري)
    const otherRequests = await getSessionRequestsForSession(sessionId);
    const pendingRequests = otherRequests.filter(
      (req) => req.id !== requestId && req.status === "pending",
    );
    for (const req of pendingRequests) {
      await updateDoc(doc(db, "sessionRequests", req.id), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });
      // === إرسال إشعار للمتقدمين المرفوضين ===
      await createNotification({
        recipientId: req.menteeId,
        senderId: requestData.mentorId, // المرسل هو الموجه
        type: "session_rejected",
        message: `Sorry, the session you requested is no longer available.`,
        relatedId: sessionId,
        read: false,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error accepting session request:", error);
    throw error;
  }
};

// 5. Reject a session request (اختياري)
export const rejectSessionRequest = async (requestId) => {
  const requestRef = doc(db, "sessionRequests", requestId);
  try {
    await updateDoc(requestRef, {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });
    // === إرسال إشعار للمتقدم المرفوض ===
    const requestData = (await getDoc(requestRef)).data();
    await createNotification({
      recipientId: requestData.menteeId, // المستلم هو المتقدم
      senderId: requestData.mentorId, // المرسل هو الموجه
      type: "session_rejected",
      message: `Sorry, your request for the session has been rejected.`,
      relatedId: requestData.sessionId,
      read: false,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting session request:", error);
    throw error;
  }
};

// 6. Get count of pending requests for a session (لعرض العدد بجانب الجلسة)
export const getPendingRequestsCountForSession = async (sessionId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("sessionId", "==", sessionId),
      where("status", "==", "pending"),
    );
    const snapshot = await getDocs(q);
    return snapshot.size; // عدد الوثائق
  } catch (error) {
    console.error("Error getting pending requests count:", error);
    return 0; // في حالة خطأ، نرجع صفر
  }
};

// 7. (اختياري) سحب طلب (إذا كنت عايز تسمح للمستخدم يسحب طلبه)
export const withdrawSessionRequest = async (requestId, userId) => {
  const requestRef = doc(db, "sessionRequests", requestId);
  try {
    const requestData = await getDoc(requestRef);
    if (
      requestData.exists() &&
      requestData.data().menteeId === userId &&
      requestData.data().status === "pending"
    ) {
      await deleteDoc(requestRef); // أو update status to 'withdrawn'
      return { success: true };
    } else {
      throw new Error("Cannot withdraw request.");
    }
  } catch (error) {
    console.error("Error withdrawing session request:", error);
    throw error;
  }
};

// دالة لجلب الجلسات المتاحة لصفحة Community
export const getAvailableSessionsForCommunity = async () => {
  try {
    const q = query(collection(db, "sessions"), where("isBooked", "==", false));
    const snapshot = await getDocs(q);
    const sessions = [];
    for (const doc of snapshot.docs) {
      const sessionData = { id: doc.id, ...doc.data() };
      // جلب اسم الموجه (mentor name) من users collection
      const mentorDoc = await getDoc(doc(db, "users", sessionData.mentorId));
      if (mentorDoc.exists()) {
        sessionData.mentorName = mentorDoc.data().name || "Mentor";
      } else {
        sessionData.mentorName = "Mentor";
      }
      sessions.push(sessionData);
    }
    return sessions;
  } catch (error) {
    console.error("Error getting available sessions:", error);
    throw error;
  }
};

// -------------------------------------------------------------------------------------------------------------------------------------------

// Wafaa Samir

// Posts CRUD Operations

// Create a new post
export const createPost = async (postData) => {
  try {
    const postRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: postRef.id, ...postData };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt = null;
      let updatedAt = null;

      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }

      if (data.updatedAt?.toDate) {
        updatedAt = data.updatedAt.toDate().toISOString();
      } else if (typeof data.updatedAt === "string") {
        updatedAt = data.updatedAt;
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Get a single post by ID
export const getPost = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const snapshot = await getDoc(postRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      let createdAt = null;
      let updatedAt = null;

      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }

      if (data.updatedAt?.toDate) {
        updatedAt = data.updatedAt.toDate().toISOString();
      } else if (typeof data.updatedAt === "string") {
        updatedAt = data.updatedAt;
      }

      return {
        id: snapshot.id,
        ...data,
        createdAt,
        updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, updateData) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { id: postId, ...updateData };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return { id: postId };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Subscribe to posts changes (real-time updates)
export const subscribeToPosts = (callback) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      let createdAt = null;
      let updatedAt = null;

      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdAt = data.createdAt;
      }

      if (data.updatedAt?.toDate) {
        updatedAt = data.updatedAt.toDate().toISOString();
      } else if (typeof data.updatedAt === "string") {
        updatedAt = data.updatedAt;
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt,
      };
    });

    callback(posts);
  });
};
