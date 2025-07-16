// "use client";

// import { useParams } from "next/navigation";
// import { mockUsers } from "@/lib/mock-data";

// export default function MentorProfile() {
//   const { id } = useParams();

//   const mentor = mockUsers.find(
//     (user) => user.id === id.toString() && user.role === "Mentor",
//   );

//   if (!mentor) {
//     return (
//       <div className="p-8">
//         <h1 className="text-xl font-bold text-red-600">Mentor Not Found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold text-[#B71C1C]">Mentor Profile</h1>
//       <p className="mt-2 text-lg text-gray-800">Name: {mentor.name}</p>
//       <p className="mt-2 text-gray-700">Email: {mentor.email}</p>
//       <p className="mt-2 text-gray-700">National ID: {mentor.nationalId}</p>
//       <p className="mt-2 text-gray-700">
//         Verification: {mentor.verificationStatus}
//       </p>
//       <p className="mt-2 text-gray-700">Joined: {mentor.createdAt}</p>
//     </div>
//   );
// }

"use client";

import { useParams } from "next/navigation";
import {
  mockUsers,
  mockMentorshipOffers,
  mockMentorshipSessions,
} from "@/lib/mock-data";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MentorProfilePage() {
  const { id } = useParams();

  const mentor = mockUsers.find(
    (user) => user.id.toString() === id && user.role === "Mentor",
  );

  if (!mentor) {
    return (
      <div className="p-8 text-center text-red-500 font-bold text-xl">
        Mentor Not Found
      </div>
    );
  }

  const mentorOffers = mockMentorshipOffers.filter(
    (offer) => offer.mentorId.toString() === mentor.id.toString(),
  );
  const mentorSessions = mockMentorshipSessions.filter(
    (session) => session.mentorId.toString() === mentor.id.toString(),
  );

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex items-center space-x-6">
        <Image
          src="/mentors/mentor3.jpg"
          alt={mentor.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-[#B71C1C]"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#B71C1C]">{mentor.name}</h1>
          <p className="text-gray-600">Email: {mentor.email}</p>
          <p className="text-gray-600">National ID: {mentor.nationalId}</p>
          <p className="text-gray-600">
            Verification: {mentor.verificationStatus}
          </p>
          <p className="text-gray-600">Joined: {mentor.createdAt}</p>
        </div>
      </div>

      <Card className="bg-[#FFEBEE]">
        <CardHeader>
          <CardTitle className="text-[#B71C1C]">Mentorship Offers</CardTitle>
        </CardHeader>
        <CardContent>
          {mentorOffers.length === 0 ? (
            <p className="text-gray-600">No offers available.</p>
          ) : (
            <ul className="space-y-3">
              {mentorOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="p-3 bg-white rounded shadow flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#B71C1C]">
                      {offer.field}
                    </p>
                    <p className="text-gray-600">
                      Availability: {offer.availability}
                    </p>
                  </div>
                  <div>
                    <Badge>
                      {offer.isPaid ? `$${offer.price}/session` : "Free"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#FFEBEE]">
        <CardHeader>
          <CardTitle className="text-[#B71C1C]">Mentorship Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {mentorSessions.length === 0 ? (
            <p className="text-gray-600">No sessions found.</p>
          ) : (
            <ul className="space-y-3">
              {mentorSessions.map((session) => (
                <li key={session.id} className="p-3 bg-white rounded shadow">
                  <p className="font-semibold text-[#B71C1C]">
                    With: {session.menteeName}
                  </p>
                  <p className="text-gray-600">Date: {session.date}</p>
                  <p className="text-gray-600">Status: {session.status}</p>
                  {session.feedback && (
                    <p className="italic text-sm text-gray-500">
                      Feedback: {session.feedback}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
