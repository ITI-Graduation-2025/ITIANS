// app/mentors/[id]/page.jsx
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
// import { getUser } from "@/services/firebase";
import { getUser } from "@/services/userServices";

import { CommunityStats } from "@/components/mentorComp/commuintyStats";
import { Header } from "@/components/mentorComp/header";
import { MentorProfile } from "@/components/mentorComp/mentor-profile";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { TabsSection } from "@/components/mentorComp/tabs-section";
import { Testimonials } from "@/components/mentorComp/testimonials";
import { authOptions } from "@/lib/nextAuth";
import Navbar from "@/components/componentts/Navbar";

export default async function MentorProfilePage({ params }) {
  const mentorIdFromUrl = params.id;

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const mentorData = await getUser(mentorIdFromUrl);
  if (!mentorData || mentorData === "User not found") {
    notFound();
  }
  if (mentorData?.profileUnderReview) {
    redirect("/pending");
  }
  if (!mentorData?.profileCompleted) {
    redirect("/mentorData");
  }

  // Ensure education is always an array
  mentorData.education = Array.isArray(mentorData.education)
    ? mentorData.education
    : mentorData.education
      ? [mentorData.education]
      : [];

  // Helper to validate date strings
  function safeDate(date) {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : date;
  }

  // Example: sanitize education dates if present
  if (Array.isArray(mentorData.education)) {
    mentorData.education = mentorData.education.map((edu) => ({
      ...edu,
      startDate: safeDate(edu.startDate),
      endDate: safeDate(edu.endDate),
    }));
  }

  const isOwner = currentUserId === mentorIdFromUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-16 px-4 md:px-0">
          <div className="flex px-4 flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-5xl">
              <MentorProfile mentor={mentorData} isOwner={isOwner} />
              <TabsSection mentor={mentorData} isOwner={isOwner} />
            </div>
            <div className="w-full lg:w-[300px] xl:w-[450px] md:flex overflow-hidden">
              <CommunityStats mentor={mentorData} isOwner={isOwner} />
            </div>
          </div>
          <Testimonials mentorId={mentorIdFromUrl} />
        </main>
      </div>
    </div>
  );
}
