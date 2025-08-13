"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import {
  Video,
  MessageCircle,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { cancelSession } from "@/services/sessionServices";
import { toast } from "sonner";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Messages from "@/app/chat/Messages";
import SendBox from "@/app/chat/SendBox";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const currentUser = useCurrentUser();
  const [session, setSession] = useState(null);
  const [mentor, setMentor] = useState({ name: "Loading..." });
  const [freelancer, setFreelancer] = useState({ name: "Loading..." });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
    title: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId || typeof sessionId !== "string") {
      console.error("Invalid sessionId:", sessionId);
      setSession(null);
      setMentor({ name: "Invalid Session ID" });
      return;
    }

    // Real-time listener for session data
    const sessionRef = doc(db, "sessions", sessionId);
    const unsubscribeSession = onSnapshot(sessionRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const sessionData = { id: docSnapshot.id, ...docSnapshot.data() };
        setSession(sessionData);

        const mentorId = sessionData.mentorId;
        const freelancerId = sessionData.freelancerId;

        if (mentorId) {
          const mentorRef = doc(db, "users", mentorId);
          getDoc(mentorRef)
            .then((mentorDoc) => {
              if (mentorDoc.exists()) {
                const mentorData = mentorDoc.data();
                setMentor({
                  id: mentorId,
                  name: mentorData.name || "Unknown Mentor",
                  rating: mentorData.rating || 0,
                });
              } else {
                console.warn(`No mentor found for mentorId: ${mentorId}`);
                setMentor({
                  id: mentorId,
                  name: "Unknown Mentor",
                  rating: 0,
                });
              }
            })
            .catch((error) => {
              console.error("Error fetching mentor:", error);
              setMentor({
                id: mentorId,
                name: "Unknown Mentor",
                rating: 0,
              });
            });
        }

        if (freelancerId) {
          const freelancerRef = doc(db, "users", freelancerId);
          getDoc(freelancerRef)
            .then((freelancerDoc) => {
              if (freelancerDoc.exists()) {
                const freelancerData = freelancerDoc.data();
                setFreelancer({
                  id: freelancerId,
                  name: freelancerData.name || "Unknown Freelancer",
                });
              } else {
                console.warn(
                  `No freelancer found for freelancerId: ${freelancerId}`,
                );
                setFreelancer({
                  id: freelancerId,
                  name: "Unknown Freelancer",
                });
              }
            })
            .catch((error) => {
              console.error("Error fetching freelancer:", error);
              setFreelancer({
                id: freelancerId,
                name: "Unknown Freelancer",
              });
            });
        }
      } else {
        console.warn(
          `No session found in sessions collection for sessionId: ${sessionId}`,
        );
        setSession(null);
        setMentor({ name: "Unknown Mentor" });
      }
    });

    // Real-time listener for booked session data
    const bookedSessionRef = doc(db, "bookedSessions", sessionId);
    const unsubscribeBooked = onSnapshot(bookedSessionRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const sessionData = { id: docSnapshot.id, ...docSnapshot.data() };
        if (!sessionData.mentorId) {
          console.warn("Session data missing mentorId:", sessionData);
          setSession((prev) => ({ ...prev, ...sessionData, mentorId: null }));
        } else {
          setSession((prev) => ({ ...prev, ...sessionData }));
        }
      } else {
        console.warn(`No session found for sessionId: ${sessionId}`);
        setSession(null);
      }
    });

    return () => {
      unsubscribeSession();
      unsubscribeBooked();
    };
  }, [sessionId]);

  useEffect(() => {
    const checkSessionStatus = async () => {
      const sessionDoc = await getDoc(doc(db, "sessions", sessionId));
      if (!sessionDoc.exists()) {
        setSession(null);
        setMentor({ name: "Session Not Found" });
        return;
      }

      const session = sessionDoc.data();
      if (session.status === "Cancelled") {
        setSession({ ...session, id: sessionId, status: "Cancelled" });
        setMentor({ name: "Session Cancelled" });
        return;
      }
    };

    checkSessionStatus();
  }, [sessionId]);

  const handleCancelSession = async () => {
    if (!currentUser?.uid) {
      toast.error("User not authenticated.");
      console.error("No user UID available");
      return;
    }
    if (!session?.id || typeof session.id !== "string") {
      toast.error("Session ID is missing or invalid. Please refresh the page.");
      console.error("Invalid session ID:", session);
      return;
    }
    if (currentUser.uid !== session.mentorId) {
      toast.error("You are not authorized to cancel this session.");
      console.error(
        "Unauthorized: User UID:",
        currentUser.uid,
        "Mentor ID:",
        session.mentorId,
      );
      return;
    }
    try {
      console.log(session.id, currentUser.uid, session.freelancerId);

      await cancelSession(session.id, currentUser.uid, session.freelancerId);
      toast.success("Session cancelled successfully!");
      router.push("/mentor");
    } catch (error) {
      console.error("Error cancelling session:", error);
      toast.error("Failed to cancel session. Please try again.");
    }
  };

  const handleCompleteSession = async () => {
    if (!currentUser?.uid || currentUser.uid !== session.mentorId) {
      toast.error("Only the mentor can complete the session.");
      return;
    }

    setIsCompletingSession(true);
    try {
      const sessionRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionRef, {
        status: "Completed",
        completedAt: serverTimestamp(),
        completedBy: currentUser.uid,
      });

      // Update booked session as well
      const bookedSessionRef = doc(db, "bookedSessions", sessionId);
      await updateDoc(bookedSessionRef, {
        status: "Completed",
        completedAt: serverTimestamp(),
      });

      setSession((prev) => ({ ...prev, status: "Completed" }));
      toast.success("Session marked as completed successfully!");

      // Show review form for freelancer automatically
      if (isFreelancer) {
        setShowReviewForm(true);
      }
    } catch (error) {
      console.error("Error completing session:", error);
      toast.error("Failed to complete session. Please try again.");
    } finally {
      setIsCompletingSession(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewData.review.trim() || !reviewData.title.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Add review to the same session document instead of creating new collection
      const sessionRef = doc(db, "sessions", sessionId);
      const sessionDoc = await getDoc(sessionRef);

      // Create new review object
      const newReview = {
        id: Date.now().toString(), // Simple ID generation
        sessionId,
        mentorId: session.mentorId || "",
        freelancerId: session.freelancerId || "",
        rating: reviewData.rating || 5,
        review: reviewData.review.trim() || "",
        title: reviewData.title.trim() || "",
        createdAt: new Date(), // Use new Date() instead of serverTimestamp() for array
        reviewerName: currentUser.name || "Anonymous",
        reviewerId: currentUser.uid || "",
      };

      // Filter out any undefined values
      const cleanReview = Object.fromEntries(
        Object.entries(newReview).filter(([_, value]) => value !== undefined),
      );

      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data();
        const reviews = sessionData.reviews || [];

        reviews.push(cleanReview);

        // Update session with new review
        await updateDoc(sessionRef, {
          reviews: reviews,
          reviewed: true,
          reviewId: cleanReview.id,
        });
      }

      // Update mentor's rating
      if (session.mentorId) {
        const mentorRef = doc(db, "users", session.mentorId);
        const mentorDoc = await getDoc(mentorRef);
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          const currentRating = mentorData.rating || 0;
          const currentReviewCount = mentorData.reviewCount || 0;
          const newRating =
            (currentRating * currentReviewCount + reviewData.rating) /
            (currentReviewCount + 1);

          await updateDoc(mentorRef, {
            rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
            reviewCount: currentReviewCount + 1,
          });
        }
      }

      // Update booked session as well
      const bookedSessionRef = doc(db, "bookedSessions", sessionId);
      await updateDoc(bookedSessionRef, {
        reviewed: true,
        reviewId: cleanReview.id,
      });

      setShowReviewForm(false);
      setReviewData({ rating: 5, review: "", title: "" });
      toast.success("Review submitted successfully!");

      // No need to manually refresh - real-time listener will handle it
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!currentUser || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center text-[var(--muted-foreground)] p-4">
          <p>{!currentUser ? "User not authenticated" : "Session not found"}</p>
        </div>
      </div>
    );
  }

  if (session.status === "Cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center text-[var(--muted-foreground)] p-4">
          <p>This session has been cancelled.</p>
          <Button
            onClick={() => router.push("/sessions")}
            className="mt-4 bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            View Available Sessions
          </Button>
        </div>
      </div>
    );
  }

  // Generate chat ID for the session
  const sessionChatId = `session_${sessionId}`;
  const isMentor = currentUser?.uid === session.mentorId;
  const isFreelancer = currentUser?.uid === session.freelancerId;
  const canComplete = isMentor && session.status === "Confirmed";
  const canReview =
    isFreelancer && session.status === "Completed" && !session.reviewed;
  const isSessionCompleted = session.status === "Completed";

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Session Info Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
              {session.title}
              {session.status === "Completed" && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[var(--muted-foreground)] mb-2">
                  <strong>Mentor:</strong> {mentor.name}
                  {mentor.rating && (
                    <span className="ml-2 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {mentor.rating}
                    </span>
                  )}
                </p>
                <p className="text-[var(--muted-foreground)] mb-2">
                  <strong>Freelancer:</strong> {freelancer.name}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted-foreground)] mb-2">
                  <strong>Date:</strong>{" "}
                  {session.date
                    ? new Date(session.date).toLocaleString("en-US")
                    : "Not specified"}
                </p>
                <p className="text-[var(--muted-foreground)] mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : session.status === "Active"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {session.status}
                  </span>
                </p>
                {session.completedAt && (
                  <p className="text-[var(--muted-foreground)] mb-4">
                    <strong>Completed:</strong>{" "}
                    {new Date(session.completedAt.toDate()).toLocaleString(
                      "en-US",
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Meeting Buttons - Only show if session is not completed */}
              {!isSessionCompleted && (
                <>
                  {session.zoomLink && (
                    <Button
                      asChild
                      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]"
                    >
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Video className="w-4 h-4 mr-2" /> Join Zoom Meeting
                      </a>
                    </Button>
                  )}
                  {session.googleMeetLink && (
                    <Button
                      asChild
                      className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]"
                    >
                      <a
                        href={session.googleMeetLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Video className="w-4 h-4 mr-2" /> Join Google Meet
                      </a>
                    </Button>
                  )}
                </>
              )}

              {/* Session Completed Message */}
              {isSessionCompleted && (
                <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-center font-medium">
                    🎉 Session completed! Meeting links and chat are now
                    disabled.
                  </p>
                </div>
              )}

              {/* Complete Session Button (Mentor Only) */}
              {canComplete && (
                <Button
                  onClick={handleCompleteSession}
                  disabled={isCompletingSession}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isCompletingSession ? "Completing..." : "Mark as Done"}
                </Button>
              )}

              {/* Review Button (Freelancer Only) */}
              {canReview && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 text-sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              )}

              {/* Cancel Session Button (Mentor Only) */}
              {isMentor && session.status === "Confirmed" && (
                <Button
                  variant="destructive"
                  onClick={handleCancelSession}
                  className="px-4 text-sm"
                  disabled={!session?.id || !session?.mentorId}
                >
                  Cancel Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Form Modal */}
        {showReviewForm && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Review Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reviewTitle">Review Title</Label>
                <Input
                  id="reviewTitle"
                  value={reviewData.title}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Brief summary of your experience"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewData((prev) => ({ ...prev, rating: star }))
                      }
                      className={`text-2xl ${
                        star <= reviewData.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {reviewData.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="review">Detailed Review</Label>
                <Textarea
                  id="review"
                  value={reviewData.review}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      review: e.target.value,
                    }))
                  }
                  placeholder="Share your experience with this mentor..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  disabled={isSubmittingReview}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Section - Show chat for reading, disable sending for completed sessions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Session Chat
              {isSessionCompleted && (
                <span className="text-sm text-gray-500 font-normal">
                  (Read Only)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
              {/* Chat Header */}

              {/* Messages Area */}
              <div className="flex-1 relative overflow-hidden">
                <Messages
                  chatId={sessionChatId}
                  currentUserId={currentUser.uid}
                />
              </div>

              {/* Send Box - Only show if session is not completed */}
              {!isSessionCompleted ? (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <SendBox
                    chatId={sessionChatId}
                    senderId={currentUser.uid}
                    senderName={currentUser.name}
                  />
                </div>
              ) : (
                /* Send Disabled Message */
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      Chat is read-only for completed sessions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
