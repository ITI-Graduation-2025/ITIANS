// src/components/mentorComp/commuintyStats.jsx
"use client";

import { useState, useEffect } from "react";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LucideLoader2 } from "lucide-react";
import {
  createSessionRequest,
  getAvailableSessions,
  getAvailableSessionsForCommunity,
} from "@/services/firebase";
import { useUserContext } from "@/context/userContext";

export function CommunityStats({ mentor, isOwner }) {
  const [communitySessions, setCommunitySessions] = useState([]);
  const [isLoadingCommunitySessions, setIsLoadingCommunitySessions] =
    useState(true);
  const { user } = useUserContext();
  // console.log(user);
  // console.log(mentor);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoadingCommunitySessions(true);
      try {
        // استدعاء الدالة اللي خليناها في firebase.js
        const sessions = await getAvailableSessions(mentor.id);
        setCommunitySessions(sessions);
        console.log("Community sessions:", sessions);
      } catch (err) {
        console.error("Failed to fetch community sessions:", err);
        toast.error("Failed to load community sessions.");
        // تعيين array فاضي كقيمة افتراضية
        setCommunitySessions([]);
      } finally {
        setIsLoadingCommunitySessions(false);
      }
    };

    fetchSessions();
  }, []);

  const handleRequestSession = async (session) => {
    if (!user || !mentor.id) {
      toast.error("You need to be logged in to request a session.");
      return;
    }
    if (user.id === session.mentorId) {
      console.log(mentor.id, session.mentorId);

      toast.error("You cannot request a session with yourself.");
      return;
    }

    try {
      await createSessionRequest(
        session.id,
        session.mentorId,
        mentor.id,
        mentor.name || "mentor",
        mentor.jobTitle || "",
      );
      toast.success("Session request sent!");
      // يمكن تحديث الواجهة علشان تظهر رسالة أو تلغي الزر مؤقتًا
      // مثلاً: إعادة تحميل الجلسات أو تعديل الـ state المحلي
    } catch (err) {
      console.error("Error requesting session:", err);
      toast.error("Failed to send request.");
    }
  };

  return (
    <div className="w-full sm:w-80  sm:p-6 space-y-4 sm:space-y-6 lg:overflow-hidden lg:col-span-2 md:w-full">
      {/* Card 1: Community statistics - زي ما هي */}
      <Card className="bg-[var(--card)] border-[var(--border)] ">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Community statistics
            </CardTitle>
            <Button
              variant="link"
              className="text-[var(--primary)] text-xs sm:text-sm p-0 mt-2 sm:mt-0"
            >
              See more {">"}
            </Button>
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

      {/* Card 2: Available sessions - معدل علشان يجيب البيانات من الفايربيز */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
            Available sessions
          </CardTitle>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Book 1:1 sessions from the options based on your needs
          </p>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* سكرول لو الجلسات كتير */}
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
                        `Session with ${session.mentorName || "Mentor"}`}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                      {session.date} at {session.time} ({session.duration})
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[var(--secondary)]">
                      {session.price}
                    </p>
                  </div>
                  <Button
                    className="mt-2 sm:mt-0 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 sm:px-6 text-xs sm:text-sm"
                    onClick={() => handleRequestSession(session)}
                    disabled={!mentor}
                  >
                    Book
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-[var(--muted-foreground)] py-2 text-sm">
                No available sessions at the moment.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Similar mentor profiles - زي ما هي */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
              Similar mentor profiles
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-[var(--foreground)] mt-2 sm:mt-0"
            >
              <span>{">"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src={
                    mentor.photo || "https://picsum.photos/200/300".trimEnd()
                  }
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                Sina Salami
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Senior Frontend Engineer at Neoco...
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src={
                    mentor.photo || "https://picsum.photos/200/300  ".trimEnd()
                  }
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                OMAR ELNABALA...
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Senior Product Designer at Master...
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[var(--muted)] rounded-lg mb-1 sm:mb-2 mx-auto">
                <Image
                  width={200}
                  height={200}
                  src={
                    mentor.photo || "https://picsum.photos/200/300  ".trimEnd()
                  }
                  alt="avatar"
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                Cassie Bjorc
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)]">
                Graphic Designer Freelance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
