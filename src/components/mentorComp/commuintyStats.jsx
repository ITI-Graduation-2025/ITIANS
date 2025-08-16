"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideLoader2 } from "lucide-react";
import {
  createSessionRequest,
  getAvailableSessionsSnapshot,
  getBookedSessionsSnapshot,
  getSessionRequestsForSession,
  withdrawSessionRequest,
  getCompletedSessionsSnapshot,
  getCompletedSessionsCount,
} from "@/services/sessionServices";
import { getAllUsers } from "@/services/userServices";
import { useUserContext } from "@/context/userContext";

export function CommunityStats({ mentor, isOwner }) {
  const [communitySessions, setCommunitySessions] = useState([]);
  const [userRequests, setUserRequests] = useState({});
  const [completedSessions, setCompletedSessions] = useState([]);
  const [similarMentors, setSimilarMentors] = useState([]);
  const [mentorSessionsCount, setMentorSessionsCount] = useState({});
  const [isLoadingCommunitySessions, setIsLoadingCommunitySessions] =
    useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [requestingSessionId, setRequestingSessionId] = useState(null);
  const { user } = useUserContext();
  const router = useRouter();

  // Calculate statistics from completed sessions
  const calculateStats = (sessions) => {
    const totalDuration = sessions.reduce((total, session) => {
      const duration = session.duration || "1h";
      const hours = duration.includes("h") ? parseInt(duration) : 0;
      const minutes =
        duration.includes("m") && !duration.includes("h")
          ? parseInt(duration)
          : 0;
      return total + hours * 60 + minutes;
    }, 0);

    return {
      totalMentoringTime: totalDuration,
      sessionsCompleted: sessions.length,
    };
  };

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
    setIsLoadingStats(true);
    let unsubscribe = () => {};
    let statsUnsubscribe = () => {};

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

        const statsCallback = (sessions) => {
          setCompletedSessions(sessions);
          setIsLoadingStats(false);
        };

        if (isOwner) {
          unsubscribe = await getBookedSessionsSnapshot(mentor.id, callback);
          statsUnsubscribe = await getCompletedSessionsSnapshot(
            mentor.id,
            statsCallback,
          );
        } else {
          unsubscribe = await getAvailableSessionsSnapshot(mentor.id, callback);
          statsUnsubscribe = await getCompletedSessionsSnapshot(
            mentor.id,
            statsCallback,
          );
        }
      } catch (err) {
        console.error("Error setting up snapshot:", err);
        toast.error("Failed to load sessions.");
        setCommunitySessions([]);
        setIsLoadingCommunitySessions(false);
        setIsLoadingStats(false);
      }
    };

    setupSnapshot();

    return () => {
      unsubscribe();
      statsUnsubscribe();
    };
  }, [mentor.id, user?.id, isOwner]);

  // Fetch similar mentors
  useEffect(() => {
    const fetchSimilarMentors = async () => {
      try {
        setIsLoadingMentors(true);
        const allUsers = await getAllUsers();
        const mentors = allUsers.filter(
          (user) =>
            user.role === "mentor" &&
            user.id !== mentor.id &&
            user.profileCompleted,
        );

        // Shuffle and take first 6 mentors
        const shuffled = mentors.sort(() => 0.5 - Math.random());
        setSimilarMentors(shuffled.slice(0, 6));

        // Fetch completed sessions count for each mentor
        const sessionsCountMap = {};
        for (const mentorUser of shuffled.slice(0, 6)) {
          try {
            const count = await getCompletedSessionsCount(mentorUser.id);
            sessionsCountMap[mentorUser.id] = count;
          } catch (error) {
            console.error(
              `Error fetching sessions count for mentor ${mentorUser.id}:`,
              error,
            );
            sessionsCountMap[mentorUser.id] = count;
          }
        }
        setMentorSessionsCount(sessionsCountMap);
      } catch (error) {
        console.error("Error fetching similar mentors:", error);
        toast.error("Failed to load similar mentors");
      } finally {
        setIsLoadingMentors(false);
      }
    };

    fetchSimilarMentors();
  }, [mentor.id]);

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

  const stats = calculateStats(completedSessions);

  // Helper functions for session status
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "confirmed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "completed":
        return "🎯";
      case "confirmed":
        return "📅";
      case "cancelled":
        return "🚫";
      default:
        return null;
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
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-[60px]">
              <LucideLoader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-[var(--primary)]">🚀</span>
                  <span className="text-[var(--muted-foreground)]">
                    Total mentoring time
                  </span>
                </div>
                <span className="font-semibold text-[var(--foreground)]">
                  {stats.totalMentoringTime} mins
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-[var(--destructive)]">🎯</span>
                  <span className="text-[var(--muted-foreground)]">
                    Sessions completed
                  </span>
                </div>
                <span className="font-semibold text-[var(--foreground)]">
                  {stats.sessionsCompleted}
                </span>
              </div>
            </>
          )}
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
                    <div className="flex items-center  mb-1">
                      <h4 className="font-medium text-sm sm:text-base text-[var(--foreground)]">
                        {session.title ||
                          `Session with ${session.mentorName || "Unknown Mentor"}`}
                      </h4>
                      {session.status && (
                        <Badge
                          variant={getStatusVariant(session.status)}
                          className="text-xl  py-1  bg-white "
                        >
                          <span>{getStatusIcon(session.status)}</span>
                        </Badge>
                      )}
                    </div>
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

      {/* Similar Mentors Slider */}
      {
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Similar Mentors
            </CardTitle>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Discover other amazing mentors in our community
            </p>
          </CardHeader>
          <CardContent>
            {isLoadingMentors ? (
              <div className="flex justify-center items-center h-[120px]">
                <LucideLoader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : similarMentors.length > 0 ? (
              <div className="relative group">
                {/* Navigation Arrows */}
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
                  onClick={() => {
                    const container = document.getElementById("mentors-slider");
                    if (container) {
                      container.scrollLeft -= 300;
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
                  onClick={() => {
                    const container = document.getElementById("mentors-slider");
                    if (container) {
                      container.scrollLeft += 300;
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Mentors Slider */}
                <div
                  id="mentors-slider"
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitScrollbar: { display: "none" },
                  }}
                >
                  {similarMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="flex-shrink-0 w-[200px] bg-white rounded-xl border border-gray-200 hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg group cursor-pointer"
                      onClick={() => router.push(`/mentor/${mentor.id}`)}
                    >
                      {/* Mentor Image */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-xl overflow-hidden">
                        {mentor.profileImage ? (
                          <img
                            src={mentor.profileImage}
                            alt={mentor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {mentor.name?.charAt(0)?.toUpperCase() || "M"}
                            </div>
                          </div>
                        )}

                        {/* Specialization Badge */}
                        {mentor.specialization && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                            {mentor.specialization}
                          </div>
                        )}
                      </div>

                      {/* Mentor Info */}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[var(--primary)] transition-colors duration-300">
                          {mentor.name || "Unknown Mentor"}
                        </h4>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {mentor.jobTitle ||
                            "Passionate mentor helping others grow"}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              {mentorSessionsCount[mentor.id] || 0} sessions
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-yellow-500">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">
                              {mentor.rating || 5.0}
                            </span>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        {/* <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                          View Profile
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-[var(--muted-foreground)] py-8 text-sm">
                No similar mentors found at the moment.
              </p>
            )}
          </CardContent>
        </Card>
      }
    </div>
  );
}
