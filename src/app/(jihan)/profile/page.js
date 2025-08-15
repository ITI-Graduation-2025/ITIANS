"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    const id = session?.user?.id;
    const role = session?.user?.role?.toLowerCase();
    if (!id) return;
    if (role === "mentor") router.replace(`/mentor/${id}`);
    else if (role === "company") router.replace(`/companies/${id}`);
    else router.replace(`/profile/${id}`);
  }, [session, status, router]);

  return <div className="min-h-screen font-sans bg-gray-50 p-6">Redirecting to your profile…</div>;
}


