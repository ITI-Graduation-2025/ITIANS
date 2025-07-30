"use client";
import FreelancerProfile from "@/components/pages/FreelancerProfile/FreelancerProfile";
import { getUser } from "@/services/userServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState();

  useEffect(() => {
    getUser(id).then((res) => setUser(res));
  }, []);

  return <FreelancerProfile user={user} refetchUser={() => getUser(id)} />;
}
