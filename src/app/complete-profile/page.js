"use client";

import CompleteProfileForm from "@/components/form/CompleteProfileForm";

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Please complete your profile to start using all platform features
          </p>
        </div>
        <CompleteProfileForm />
      </div>
    </div>
  );
}
