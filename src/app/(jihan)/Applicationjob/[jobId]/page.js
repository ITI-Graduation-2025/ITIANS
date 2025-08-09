"use client";

import Applications from "@/components/ui/Applications";
import { useParams } from "next/navigation";

export default function Page() {
  const { jobId } = useParams();

  return <Applications jobId={jobId} />;
}
