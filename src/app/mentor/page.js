import { CommunityStats } from "@/components/mentorComp/commuintyStats";
import { Header } from "@/components/mentorComp/header";
import { MentorProfile } from "@/components/mentorComp/mentor-profile";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { TabsSection } from "@/components/mentorComp/tabs-section";
import { Testimonials } from "@/components/mentorComp/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-16 px-4 md:px-0">
          <div className="flex px-4 flex-col lg:flex-row gap-4 ">
            <div className="flex-1 max-w-5xl">
              <MentorProfile />
              <TabsSection />
            </div>
            <div className="w-full lg:w-[300px] xl:w-[300px] md:flex overflow-hidden">
              <CommunityStats />
            </div>
          </div>
          <Testimonials />
        </main>
      </div>
    </div>
  );
}
