// app/(islam)/mentor/page.js
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
// import { getUser } from "@/services/firebase";
import { getUser } from "@/services/userServices";
import { notFound, redirect } from "next/navigation";

import { CommunityStats } from "@/components/mentorComp/commuintyStats";
import { Header } from "@/components/mentorComp/header";
import { MentorProfile } from "@/components/mentorComp/mentor-profile";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { TabsSection } from "@/components/mentorComp/tabs-section";
import { Testimonials } from "@/components/mentorComp/testimonials";
import Navbar from "@/components/componentts/Navbar";

export default async function MentorHome() {
  // ✅ 1. Get the current session
  const session = await getServerSession(authOptions);
  const mentorId = session?.user?.id;

  // ✅ 2. Get mentor data from Firestore
  const mentor = await getUser(mentorId);
  if (!mentor || mentor === "User not found") {
    notFound(); // Show 404 page
  }
  if (mentor?.profileUnderReview) {
    redirect("/pending");
  }
  if (!mentor?.profileCompleted) {
    redirect("/mentorData");
  }

  // Ensure mentor.education is always an array
  mentor.education = Array.isArray(mentor.education) ? mentor.education : [];

  // ✅ 3. Pass mentor as props to all components
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-16 px-4 md:px-0">
          <div className="flex px-4 flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-5xl">
              <MentorProfile mentor={mentor} isOwner />
              <TabsSection mentor={mentor} isOwner />
            </div>
            <div className="w-full lg:w-[300px] xl:w-[450px] md:flex overflow-hidden">
              <CommunityStats mentor={mentor} isOwner />
            </div>
          </div>
          <Testimonials mentorId={mentorId} />
        </main>
      </div>
    </div>
  );
}
