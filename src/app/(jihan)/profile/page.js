"use client"
import FreelancerProfile from "@/components/pages/FreelancerProfile/FreelancerProfile";
import { useUserContext } from "@/context/userContext";

export default function Profile() {
  const { user, refetchUser } = useUserContext();
  return <FreelancerProfile user={user} refetchUser={refetchUser} />;
}
