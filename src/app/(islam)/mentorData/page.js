import MentorProfileForm from "@/components/mentor-data/mentorProfileForm";

export default function Home() {
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
