"use client";
import FreelancerProfile from "@/components/pages/FreelancerProfile/FreelancerProfile";
import { useUserContext } from "@/context/userContext";
import { getUser } from "@/services/userServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user: currentUser } = useUserContext();
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState();

  useEffect(() => {
    getUser(id).then((res) => setUser(res));
  }, []);

  const refetchUser = async () => {
    const updatedUser = await getUser(id);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <FreelancerProfile
      user={id!==currentUser?.id ? user : currentUser}
      refetchUser={refetchUser}
    />
  );
}
