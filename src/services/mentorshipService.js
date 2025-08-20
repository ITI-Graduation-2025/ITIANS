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
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";

// --- Mentorship Sessions ---
export const getAllMentorshipSessions = async () => {
  try {
    const snapshot = await getDocs(collection(db, "sessions"));

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
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      };
    });
  } catch (error) {
    console.error("Error fetching mentorship sessions:", error);
    throw error;
  }
};

export const getMentorshipSessionsSnapshot = async (callback) => {
  try {
    const q = query(collection(db, "sessions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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

        const sessions = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
            date: convertTimestamp(data.date),
            startTime: convertTimestamp(data.startTime),
            endTime: convertTimestamp(data.endTime),
          };
        });
        callback(sessions);
      },
      (error) => {
        console.error("Snapshot error:", error);
        callback([]);
      },
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up sessions snapshot:", error);
    throw error;
  }
};

export const getMentorshipSessionsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, "sessions"),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);

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
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      };
    });
  } catch (error) {
    console.error("Error fetching sessions by status:", error);
    throw error;
  }
};

export const getMentorshipSessionsByMentor = async (mentorId) => {
  try {
    const q = query(
      collection(db, "sessions"),
      where("mentorId", "==", mentorId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);

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
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      };
    });
  } catch (error) {
    console.error("Error fetching sessions by mentor:", error);
    throw error;
  }
};

export const getMentorshipSessionsByMentee = async (menteeId) => {
  try {
    const q = query(
      collection(db, "sessions"),
      where("bookedBy", "==", menteeId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);

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
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      };
    });
  } catch (error) {
    console.error("Error fetching sessions by mentee:", error);
    throw error;
  }
};

// --- Mentorship Requests ---
export const getAllMentorshipRequests = async () => {
  try {
    const snapshot = await getDocs(collection(db, "sessionRequests"));

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
        requestedAt: convertTimestamp(data.requestedAt),
      };
    });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    throw error;
  }
};

export const getMentorshipRequestsSnapshot = async (callback) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(requests);
      },
      (error) => {
        console.error("Snapshot error:", error);
        callback([]);
      },
    );
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up requests snapshot:", error);
    throw error;
  }
};

export const getMentorshipRequestsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching requests by status:", error);
    throw error;
  }
};

export const getMentorshipRequestsByMentor = async (mentorId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("mentorId", "==", mentorId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching requests by mentor:", error);
    throw error;
  }
};

export const getMentorshipRequestsByMentee = async (menteeId) => {
  try {
    const q = query(
      collection(db, "sessionRequests"),
      where("menteeId", "==", menteeId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching requests by mentee:", error);
    throw error;
  }
};

// --- Session Management ---
export const updateSessionStatus = async (
  sessionId,
  status,
  additionalData = {},
) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating session status:", error);
    throw error;
  }
};

export const completeSession = async (sessionId, completedBy, completedAt) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, {
      status: "Completed",
      completedBy,
      completedAt: completedAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error completing session:", error);
    throw error;
  }
};

export const cancelSession = async (sessionId, reason = "") => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, {
      status: "Cancelled",
      cancelReason: reason,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error cancelling session:", error);
    throw error;
  }
};

// --- Request Management ---
export const updateRequestStatus = async (
  requestId,
  status,
  additionalData = {},
) => {
  try {
    const requestRef = doc(db, "sessionRequests", requestId);
    await updateDoc(requestRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

export const approveRequest = async (requestId, approvedBy) => {
  try {
    const requestRef = doc(db, "sessionRequests", requestId);
    await updateDoc(requestRef, {
      status: "approved",
      approvedBy,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error approving request:", error);
    throw error;
  }
};

export const rejectRequest = async (requestId, rejectedBy, reason = "") => {
  try {
    const requestRef = doc(db, "sessionRequests", requestId);
    await updateDoc(requestRef, {
      status: "rejected",
      rejectedBy,
      rejectedAt: serverTimestamp(),
      rejectReason: reason,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
};

// --- Reviews Management ---
export const getSessionReviews = async (sessionId) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      return sessionData.reviews || [];
    }

    return [];
  } catch (error) {
    console.error("Error fetching session reviews:", error);
    throw error;
  }
};

export const addSessionReview = async (sessionId, review) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      const reviews = sessionData.reviews || [];

      const newReview = {
        id: Date.now().toString(),
        ...review,
        createdAt: serverTimestamp(),
      };

      reviews.push(newReview);

      await updateDoc(sessionRef, {
        reviews,
        reviewed: true,
        reviewId: newReview.id,
        updatedAt: serverTimestamp(),
      });

      return { success: true, review: newReview };
    }

    throw new Error("Session not found");
  } catch (error) {
    console.error("Error adding session review:", error);
    throw error;
  }
};

export const updateSessionReview = async (
  sessionId,
  reviewId,
  updatedReview,
) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      const reviews = sessionData.reviews || [];

      const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

      if (reviewIndex !== -1) {
        reviews[reviewIndex] = {
          ...reviews[reviewIndex],
          ...updatedReview,
          updatedAt: serverTimestamp(),
        };

        await updateDoc(sessionRef, {
          reviews,
          updatedAt: serverTimestamp(),
        });

        return { success: true, review: reviews[reviewIndex] };
      }

      throw new Error("Review not found");
    }

    throw new Error("Session not found");
  } catch (error) {
    console.error("Error updating session review:", error);
    throw error;
  }
};

export const deleteSessionReview = async (sessionId, reviewId) => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data();
      const reviews = sessionData.reviews || [];

      const filteredReviews = reviews.filter(
        (review) => review.id !== reviewId,
      );

      await updateDoc(sessionRef, {
        reviews: filteredReviews,
        reviewed: filteredReviews.length > 0,
        reviewId: filteredReviews.length > 0 ? filteredReviews[0].id : null,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    }

    throw new Error("Session not found");
  } catch (error) {
    console.error("Error deleting session review:", error);
    throw error;
  }
};

// --- Statistics ---
export const getMentorshipStatistics = async () => {
  try {
    const [sessionsSnapshot, bookedSessionsSnapshot, sessionRequestsSnapshot] =
      await Promise.all([
        getDocs(collection(db, "sessions")),
        getDocs(collection(db, "bookedSessions")),
        getDocs(collection(db, "sessionRequests")),
      ]);

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

    const sessions = sessionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
      };
    });

    const bookedSessions = bookedSessionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        date: convertTimestamp(data.date),
        startTime: convertTimestamp(data.startTime),
        endTime: convertTimestamp(data.endTime),
        bookedAt: convertTimestamp(data.bookedAt),
      };
    });

    const sessionRequests = sessionRequestsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        requestedAt: convertTimestamp(data.requestedAt),
      };
    });

    // Combine sessions and bookedSessions for comprehensive stats
    const allSessions = [...sessions, ...bookedSessions];

    const stats = {
      totalSessions: allSessions.length,
      totalRequests: sessionRequests.length,
      completedSessions: allSessions.filter((s) => s.status === "Completed")
        .length,
      pendingSessions: allSessions.filter((s) => s.status === "Pending").length,
      confirmedSessions: allSessions.filter((s) => s.status === "Confirmed")
        .length,
      cancelledSessions: allSessions.filter((s) => s.status === "Cancelled")
        .length,
      pendingRequests: sessionRequests.filter((r) => r.status === "pending")
        .length,
      approvedRequests: sessionRequests.filter((r) => r.status === "approved")
        .length,
      rejectedRequests: sessionRequests.filter((r) => r.status === "rejected")
        .length,
      totalReviews: allSessions.reduce(
        (total, session) => total + (session.reviews?.length || 0),
        0,
      ),
      averageRating: (() => {
        const allRatings = allSessions
          .flatMap(
            (session) => session.reviews?.map((review) => review.rating) || [],
          )
          .filter((rating) => typeof rating === "number");

        if (allRatings.length === 0) return 0;
        return (
          Math.round(
            (allRatings.reduce((sum, rating) => sum + rating, 0) /
              allRatings.length) *
              10,
          ) / 10
        );
      })(),
    };

    return stats;
  } catch (error) {
    console.error("Error fetching mentorship statistics:", error);
    throw error;
  }
};

// --- Search and Filter ---
export const searchMentorshipSessions = async (searchTerm, filters = {}) => {
  try {
    let q = collection(db, "sessions");
    const constraints = [];

    if (searchTerm) {
      // Note: Firestore doesn't support full-text search, so we'll filter client-side
      // In production, consider using Algolia or similar service
    }

    if (filters.status && filters.status !== "all") {
      constraints.push(where("status", "==", filters.status));
    }

    if (filters.mentorId) {
      constraints.push(where("mentorId", "==", filters.mentorId));
    }

    if (filters.dateFrom) {
      constraints.push(where("date", ">=", filters.dateFrom));
    }

    if (filters.dateTo) {
      constraints.push(where("date", "<=", filters.dateTo));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints, orderBy("createdAt", "desc"));
    } else {
      q = query(q, orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Client-side search if searchTerm is provided
    if (searchTerm) {
      results = results.filter(
        (session) =>
          session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.mentorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.bookedBy?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return results;
  } catch (error) {
    console.error("Error searching mentorship sessions:", error);
    throw error;
  }
};

export const searchMentorshipRequests = async (searchTerm, filters = {}) => {
  try {
    let q = collection(db, "sessionRequests");
    const constraints = [];

    if (filters.status && filters.status !== "all") {
      constraints.push(where("status", "==", filters.status));
    }

    if (filters.mentorId) {
      constraints.push(where("mentorId", "==", filters.mentorId));
    }

    if (filters.menteeId) {
      constraints.push(where("menteeId", "==", filters.menteeId));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints, orderBy("createdAt", "desc"));
    } else {
      q = query(q, orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Client-side search if searchTerm is provided
    if (searchTerm) {
      results = results.filter(
        (request) =>
          request.menteeName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.menteeTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return results;
  } catch (error) {
    console.error("Error searching mentorship requests:", error);
    throw error;
  }
};

// --- Utility Functions ---
export const formatSessionData = (session) => {
  return {
    ...session,
    formattedDate: session.date
      ? new Date(session.date).toLocaleDateString()
      : "N/A",
    formattedTime: session.time || "N/A",
    duration: session.duration || "N/A",
    hasReviews: session.reviews && session.reviews.length > 0,
    averageRating:
      session.reviews && session.reviews.length > 0
        ? Math.round(
            (session.reviews.reduce(
              (sum, review) => sum + (review.rating || 0),
              0,
            ) /
              session.reviews.length) *
              10,
          ) / 10
        : 0,
    totalReviews: session.reviews ? session.reviews.length : 0,
  };
};

export const formatRequestData = (request) => {
  return {
    ...request,
    formattedCreatedAt: request.createdAt
      ? new Date(request.createdAt).toLocaleDateString()
      : "N/A",
    formattedUpdatedAt: request.updatedAt
      ? new Date(request.updatedAt).toLocaleDateString()
      : "N/A",
  };
};

// --- Mentor Testimonials ---
export const getMentorTestimonials = async (mentorId) => {
  try {
    // Get all sessions for this mentor
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("mentorId", "==", mentorId),
      where("status", "==", "Completed"),
    );
    const sessionsSnapshot = await getDocs(sessionsQuery);

    // Get all booked sessions for this mentor
    const bookedSessionsQuery = query(
      collection(db, "bookedSessions"),
      where("mentorId", "==", mentorId),
      where("status", "==", "Completed"),
    );
    const bookedSessionsSnapshot = await getDocs(bookedSessionsQuery);

    // Combine all sessions
    const allSessions = [
      ...sessionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...bookedSessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    ];

    // Extract all reviews from completed sessions
    const testimonials = [];

    for (const session of allSessions) {
      if (session.reviews && Array.isArray(session.reviews)) {
        for (const review of session.reviews) {
          // Get user data for the reviewer
          let reviewerName = review.reviewerName || "Anonymous";
          let reviewerRole = "Mentee";

          try {
            if (review.reviewerId) {
              const userRef = doc(db, "users", review.reviewerId);
              const userDoc = await getDoc(userRef);
              if (userDoc.exists()) {
                const userData = userDoc.data();
                reviewerName =
                  userData.name || review.reviewerName || "Anonymous";
                reviewerRole = userData.role || "Mentee";
              }
            }
          } catch (error) {
            console.error("Error fetching reviewer data:", error);
          }

          testimonials.push({
            id: review.id || `${session.id}-${Date.now()}`,
            name: reviewerName,
            review: review.review || review.title || "Great session!",
            rating: review.rating || 5,
            role: reviewerRole,
            sessionTitle: session.title || "Mentorship Session",
            date: review.createdAt || session.completedAt || session.updatedAt,
            sessionId: session.id,
          });
        }
      }
    }

    // Sort by date (newest first) and return
    return testimonials.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching mentor testimonials:", error);
    throw error;
  }
};
