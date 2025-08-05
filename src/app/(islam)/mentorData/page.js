"use client";

import MentorProfileForm from "@/components/mentor-data/mentorProfileForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user is not a mentor
    if (session?.user?.role !== "mentor") {
      router.push("/");
      return;
    }

    // Check if profile is already completed
    if (session?.user?.profileCompleted) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Mentor Profile
            </h1>
            <p className="text-muted-foreground">
              Help us understand your expertise to connect you with the right
              mentees
            </p>
          </div>
          <MentorProfileForm />
        </div>
      </div>
    </div>
  );
}
