"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideLoader2 } from "lucide-react";
import {
  createSessionRequest,
  getAvailableSessionsSnapshot,
  getBookedSessionsSnapshot,
  getSessionRequestsForSession,
  withdrawSessionRequest,
} from "@/services/sessionServices";
import { useUserContext } from "@/context/userContext";

export function CommunityStats({ mentor, isOwner }) {
  const [communitySessions, setCommunitySessions] = useState([]);
  const [userRequests, setUserRequests] = useState({});
  const [isLoadingCommunitySessions, setIsLoadingCommunitySessions] =
    useState(true);
  const [requestingSessionId, setRequestingSessionId] = useState(null);
  const { user } = useUserContext();
  const router = useRouter();

  const fetchRequests = async (sessions) => {
    if (user?.id && !isOwner) {
      const requestsMap = {};
      for (const session of sessions) {
        const requests = await getSessionRequestsForSession(session.id);
        const userRequest = requests.find(
          (req) => req.menteeId === user.id && req.status === "pending",
        );
        requestsMap[session.id] = userRequest
          ? { id: userRequest.id, menteeId: user.id, status: "pending" }
          : null;
      }
      setUserRequests(requestsMap);
    }
  };

  useEffect(() => {
    setIsLoadingCommunitySessions(true);
    let unsubscribe = () => {};

    const setupSnapshot = async () => {
      try {
        const callback = (sessions) => {
          const updatedSessions = sessions.map((session) => ({
            ...session,
            isBooked: session.isBooked || false,
            bookedBy: session.bookedBy || null,
            mentorName: session.mentorName || "Unknown Mentor",
          }));
          setCommunitySessions(updatedSessions);
          fetchRequests(updatedSessions);
          setIsLoadingCommunitySessions(false);
        };

        if (isOwner) {
          unsubscribe = await getBookedSessionsSnapshot(mentor.id, callback);
        } else {
          unsubscribe = await getAvailableSessionsSnapshot(mentor.id, callback);
        }
      } catch (err) {
        console.error("Error setting up snapshot:", err);
        toast.error("Failed to load sessions.");
        setCommunitySessions([]);
        setIsLoadingCommunitySessions(false);
      }
    };

    setupSnapshot();

    return () => unsubscribe();
  }, [mentor.id, user?.id, isOwner]);

  const handleRequestSession = async (session) => {
    if (!user || !mentor.id) {
      toast.error("You need to be logged in to request a session.");
      return;
    }
    if (user.id === session.mentorId) {
      toast.error("You cannot request a session with yourself.");
      return;
    }
    if (userRequests[session.id]?.status === "pending") {
      toast.error("You have already submitted a request for this session.");
      return;
    }
    if (session.isBooked) {
      toast.error("This session is already booked.");
      return;
    }
    if (requestingSessionId === session.id) return;

    setRequestingSessionId(session.id);
    try {
      const requestId = await createSessionRequest(
        session.id,
        session.mentorId,
        user.id,
        user.name || "Mentee",
        user.jobTitle || "Freelancer",
      );
      setUserRequests((prev) => ({
        ...prev,
        [session.id]: { id: requestId, menteeId: user.id, status: "pending" },
      }));
      toast.success("Request submitted successfully!");
    } catch (err) {
      console.error("Error requesting session:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setRequestingSessionId(null);
    }
  };

  const handleCancelRequest = async (requestId, sessionId) => {
    if (!requestId || !sessionId || !user?.id) {
      toast.error("Invalid request or session.");
      return;
    }
    try {
      await withdrawSessionRequest(requestId, user.id);
      setUserRequests((prev) => ({ ...prev, [sessionId]: null }));
      toast.success("Request cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling request:", err);
      toast.error(err.message || "Failed to cancel request.");
    }
  };

  return (
    <div className="w-full sm:w-80 sm:p-6 space-y-4 sm:space-y-6 lg:overflow-hidden lg:col-span-2 md:w-full">
      {/* Statistics */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Community statistics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[var(--primary)]">🚀</span>
              <span className="text-[var(--muted-foreground)]">
                Total mentoring time
              </span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              165 mins
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[var(--destructive)]">🎯</span>
              <span className="text-[var(--muted-foreground)]">
                Sessions completed
              </span>
            </div>
            <span className="font-semibold text-[var(--foreground)]">5</span>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
            {isOwner ? "Your booked sessions" : "Available sessions"}
          </CardTitle>
          {!isOwner && (
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Book 1:1 sessions from the options based on your needs
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {isLoadingCommunitySessions ? (
              <div className="flex justify-center items-center h-[100px]">
                <LucideLoader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
              </div>
            ) : communitySessions && communitySessions.length > 0 ? (
              communitySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg border-[var(--border)] mb-3 last:mb-0"
                >
                  <div>
                    <h4 className="font-medium text-sm sm:text-base text-[var(--foreground)]">
                      {session.title ||
                        `Session with ${session.mentorName || "Unknown Mentor"}`}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                      {session.date} at {session.time} ({session.duration})
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[var(--secondary)]">
                      {session.price}
                    </p>
                  </div>
                  {isOwner ? (
                    <Button
                      className="mt-2 sm:mt-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm"
                      onClick={() => router.push(`/session/${session.id}`)}
                    >
                      Go to Session
                    </Button>
                  ) : session.isBooked && session.bookedBy === user?.id ? (
                    <Button
                      className="mt-2 sm:mt-0 bg-[var(--primary)]/50 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm cursor-not-allowed"
                      disabled
                    >
                      Booked
                    </Button>
                  ) : userRequests[session.id]?.status === "pending" ? (
                    <Button
                      variant="destructive"
                      className="mt-2 sm:mt-0 px-4 sm:px-6 text-xs sm:text-sm"
                      onClick={() =>
                        handleCancelRequest(
                          userRequests[session.id].id,
                          session.id,
                        )
                      }
                    >
                      Cancel Request
                    </Button>
                  ) : (
                    <Button
                      className="mt-2 sm:mt-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm"
                      onClick={() => handleRequestSession(session)}
                      disabled={
                        session.isBooked ||
                        !mentor ||
                        requestingSessionId === session.id
                      }
                    >
                      {requestingSessionId === session.id
                        ? "Requesting..."
                        : session.isBooked
                          ? "Booked"
                          : "Book"}
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-[var(--muted-foreground)] py-2 text-sm">
                {isOwner
                  ? "No booked sessions yet."
                  : "No available sessions at the moment."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
