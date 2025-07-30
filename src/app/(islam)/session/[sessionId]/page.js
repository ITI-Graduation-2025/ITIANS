"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
// import { cancelSession } from "@/services/firebase";
import { cancelSession } from "@/services/sessionServices";
import { toast } from "sonner";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const currentUser = useCurrentUser();
  const [session, setSession] = useState(null);
  const [mentor, setMentor] = useState({ name: "Loading..." });
  const router = useRouter();

  useEffect(() => {
    if (!sessionId || typeof sessionId !== "string") {
      console.error("Invalid sessionId:", sessionId);
      setSession(null);
      setMentor({ name: "Invalid Session ID" });
      return;
    }

    const bookedSessionRef = doc(db, "bookedSessions", sessionId);
    getDoc(bookedSessionRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const sessionData = { id: docSnapshot.id, ...docSnapshot.data() };
          // console.log("Fetched Session Data:", sessionData);
          if (!sessionData.mentorId) {
            console.warn("Session data missing mentorId:", sessionData);
            setSession({ ...sessionData, mentorId: null });
          } else {
            setSession(sessionData);
          }
        } else {
          console.warn(`No session found for sessionId: ${sessionId}`);
          setSession(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        setSession(null);
      });

    const sessionRef = doc(db, "sessions", sessionId);
    getDoc(sessionRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const sessionData = docSnapshot.data();
          const mentorId = sessionData.mentorId;
          if (mentorId) {
            const mentorRef = doc(db, "users", mentorId);
            getDoc(mentorRef)
              .then((mentorDoc) => {
                if (mentorDoc.exists()) {
                  const mentorData = mentorDoc.data();
                  setMentor({ name: mentorData.name || "Unknown Mentor" });
                } else {
                  console.warn(`No mentor found for mentorId: ${mentorId}`);
                  setMentor({ name: "Unknown Mentor" });
                }
              })
              .catch((error) => {
                console.error("Error fetching mentor:", error);
                setMentor({ name: "Unknown Mentor" });
              });
          } else {
            console.warn("No mentorId found in session data");
            setMentor({ name: "No Mentor Assigned" });
          }
        } else {
          console.warn(
            `No session found in sessions collection for sessionId: ${sessionId}`,
          );
          setMentor({ name: "Unknown Mentor" });
        }
      })
      .catch((error) => {
        console.error("Error fetching session details:", error);
        setMentor({ name: "Unknown Mentor" });
      });
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
  // console.log(session);

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

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-3xl mx-auto bg-[var(--card)] shadow-lg rounded-[var(--radius-lg)] p-6">
        <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">
          {session.title}
        </h1>
        <p className="text-[var(--muted-foreground)] mb-2">
          Mentor: {mentor.name}
        </p>
        <p className="text-[var(--muted-foreground)] mb-2">
          Date:{" "}
          {session.date
            ? new Date(session.date).toLocaleString("en-US")
            : "Not specified"}
        </p>
        <p className="text-[var(--muted-foreground)] mb-4">
          Status: {session.status}
        </p>
        <div className="flex gap-4">
          {session.zoomLink && (
            <Button
              asChild
              className="bg-[var(--primary)] hover:bg-[var(--destructive)] text-[var(--primary-foreground)]"
            >
              <a href={session.zoomLink} target="_blank" rel="noreferrer">
                <Video className="w-4 h-4 mr-2" /> Join Zoom
              </a>
            </Button>
          )}
          {session.googleMeetLink && (
            <Button
              asChild
              className="bg-[var(--primary)] hover:bg-[var(--destructive)] text-[var(--primary-foreground)]"
            >
              <a href={session.googleMeetLink} target="_blank" rel="noreferrer">
                <Video className="w-4 h-4 mr-2" /> Join Google Meet
              </a>
            </Button>
          )}
          {currentUser?.uid === session.mentorId && (
            <Button
              variant="destructive"
              onClick={handleCancelSession}
              className="mt-2 sm:mt-0 px-4 sm:px-6 text-xs sm:text-sm"
              disabled={!session?.id || !session?.mentorId}
            >
              Cancel Session
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
