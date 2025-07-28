"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  MoreHorizontal,
  Linkedin,
  Globe,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function MentorProfile({ mentor, isOwner }) {
  const [isBioOpen, setIsBioOpen] = useState(false);
  const maxBioLines = 3;
  const bioLineHeight = 24;
  const isBioLong = mentor?.bio && mentor.bio.split("\n").length > maxBioLines;

  const router = useRouter();

  if (!mentor) {
    return <div>Mentor not found</div>;
  }

  return (
    <div className="bg-[var(--card)]">
      <div className="relative bg-gradient-to-r from-[#200122] to-[#6f0000] h-48 sm:h-64 overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end h-full px-4 sm:px-6 pb-4 sm:pb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 sm:w-32 h-24 sm:h-32 bg-[var(--card)] rounded-full p-1">
              <Image
                src={mentor.photo || "https://picsum.photos/200/300"}
                width={200}
                height={200}
                alt={mentor.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="text-white text-center sm:text-left pb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                <span>{mentor.name}</span>
                <span className="text-lg sm:text-xl md:text-2xl">🇪🇬</span>
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-[var(--muted-foreground)] mt-1">
                {mentor.jobTitle} at {mentor.company}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-3 pb-2">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Heart className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              {isOwner && (
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent align="end">
                {isOwner && (
                  <DropdownMenuItem
                    onClick={() => router.push("/mentorEdit")}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="max-w-full sm:max-w-4xl mx-auto">
          <div
            className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: maxBioLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxHeight: `${maxBioLines * bioLineHeight}px`,
            }}
          >
            {mentor.bio}
          </div>
          {isBioLong && (
            <Dialog open={isBioOpen} onOpenChange={setIsBioOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 text-[var(--primary)] font-medium text-sm sm:text-base"
                >
                  See more
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] rounded-lg p-4">
                <DialogHeader>
                  <DialogTitle className="text-[var(--foreground)] text-lg">
                    About {mentor.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto text-[var(--foreground)] text-sm sm:text-base">
                  {mentor.bio}
                </div>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-6">
            {mentor.links?.map((link, index) => {
              const hostname = new URL(link.url).hostname.toLowerCase();
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="p-2 bg-transparent border-[var(--border)]"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {hostname.includes("linkedin") ? (
                      <Linkedin className="w-4 h-4 text-[var(--primary)]" />
                    ) : (
                      <Globe className="w-4 h-4 text-[var(--primary)]" />
                    )}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
