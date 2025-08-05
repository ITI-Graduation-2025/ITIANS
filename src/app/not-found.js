"use client";

import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] flex items-center justify-center">
      <Image
        src="/404-animation.gif"
        alt="404 Not Found"
        fill
        className="object-contain"
        unoptimized
      />
      {/* <div className="absolute right-20 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--primary)] text-[var(--muted)] rounded-md hover:bg-[#7a171c] transition text-lg font-medium shadow-md"
        >
          Back to Home
        </Link>
      </div> */}
    </div>
  );
}
