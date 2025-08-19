// app/(islam)/bookings/page.js
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/services/userServices";
import { Header } from "@/components/mentorComp/header";
import { Sidebar } from "@/components/mentorComp/sidebar";
import { BookingSessions } from "@/components/bookingComp/booking-sessions";
import Navbar from "@/components/componentts/Navbar";

export default async function BookingsPage() {
  // ✅ 1. Get the current session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // ✅ 2. Get all mentors for booking
  const allUsers = await getAllUsers();
  const mentors = allUsers.filter(
    (user) =>
      user.role === "mentor" &&
      user.profileCompleted &&
      !user.profileUnderReview,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-16 px-4 md:px-0">
          <div className="flex px-4 flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-7xl">
              <BookingSessions mentors={mentors} currentUser={session.user} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
