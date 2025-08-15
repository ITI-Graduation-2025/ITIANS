"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatedLoader } from "@/components/ui/AnimatedLoader";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    
    const id = session?.user?.id;
    const role = session?.user?.role?.toLowerCase();
    
    if (!id) return;
    
    setRedirecting(true);
    
  
    const timer = setTimeout(() => {
      if (role === "mentor") {
        router.replace(`/mentor/${id}`);
      } else if (role === "company") {
        router.replace(`/companies/${id}`);
      } else {
        router.replace(`/profile/${id}`);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  if (status === "loading" || redirecting) {
    return (
      <AnimatedLoader 
        type="dots"
        size="large"
        text="Redirecting to your profile..."
      />
    );
  }

  if (status === "unauthenticated") {
    return (
      <AnimatedLoader 
        type="dots"
        size="large"
        text="Please log in to continue..."
      />
    );
  }

  return null;
}


