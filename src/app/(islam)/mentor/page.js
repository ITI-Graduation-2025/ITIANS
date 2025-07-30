// app/(islam)/mentor/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
// import { getUser } from "@/services/firebase";
import { getUser } from "@/services/userServices";
import { notFound } from "next/navigation";

import { Header } from "@/components/mentorComp/header";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { MentorProfile } from "@/components/mentorComp/mentor-profile";
import { TabsSection } from "@/components/mentorComp/tabs-section";
import { Testimonials } from "@/components/mentorComp/testimonials";
import { CommunityStats } from "@/components/mentorComp/commuintyStats";

export default async function MentorHome() {
  // ✅ 1. Get the current session
  const session = await getServerSession(authOptions);
  const mentorId = session?.user?.id;

  // ✅ 2. Get mentor data from Firestore
  const mentor = await getUser(mentorId);
  if (!mentor || mentor === "User not found") {
    notFound(); // Show 404 page
  }

  // ✅ 3. Pass mentor as props to all components
  return (
    <div className="min-h-screen bg-gray-50">
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
