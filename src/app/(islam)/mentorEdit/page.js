"use client";
import MentorProfileForm from "@/components/mentor-data/mentorProfileForm";
import { useUserContext } from "@/context/userContext";

export default function EditProfilePage() {
  const { user } = useUserContext();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Edit Your Profile
            </h1>
            <p className="text-muted-foreground">
              Update your information below
            </p>
          </div>
          <MentorProfileForm mode="edit" initialData={user} />
        </div>
      </div>
    </div>
  );
}
