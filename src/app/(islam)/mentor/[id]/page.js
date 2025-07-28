// app/mentors/[id]/page.jsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUser } from "@/services/firebase";

import { Header } from "@/components/mentorComp/header";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { MentorProfile } from "@/components/mentorComp/mentor-profile";
import { TabsSection } from "@/components/mentorComp/tabs-section";
import { Testimonials } from "@/components/mentorComp/testimonials";
import { CommunityStats } from "@/components/mentorComp/commuintyStats";
import { authOptions } from "@/lib/nextAuth";

export default async function MentorProfilePage({ params }) {
  const mentorIdFromUrl = params.id;

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const mentorData = await getUser(mentorIdFromUrl);
  if (!mentorData || mentorData === "User not found") {
    notFound();
  }

  const isOwner = currentUserId === mentorIdFromUrl;

  return (
    <div className="min-h-screen bg-gray-50">
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
