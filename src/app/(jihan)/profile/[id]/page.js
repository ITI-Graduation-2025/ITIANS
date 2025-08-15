"use client";
import FreelancerProfile from "@/components/pages/FreelancerProfile/FreelancerProfile";
import { useUserContext } from "@/context/userContext";
import { getUser } from "@/services/userServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedLoader } from "@/components/ui/AnimatedLoader";

export default function Profile() {
  const { user: currentUser } = useUserContext();
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(id);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const refetchUser = async () => {
    try {
      setLoading(true);
      const updatedUser = await getUser(id);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error refetching user:", err);
      setError("Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AnimatedLoader 
        type="dots"
        size="xl"
        text="Loading profile..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <FreelancerProfile
      user={id !== currentUser?.id ? user : currentUser}
      refetchUser={refetchUser}
    />
  );
}
