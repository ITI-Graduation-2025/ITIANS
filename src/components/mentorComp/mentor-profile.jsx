"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Heart,
  MoreHorizontal,
  Linkedin,
  Globe,
} from "lucide-react";
import Image from "next/image";

export function MentorProfile() {
  return (
    <div className="bg-[var(--card)]">
      {/* Gradient Header */}
      <div className="relative bg-gradient-to-r from-[#200122] to-[#6f0000] h-48 sm:h-64 overflow-hidden">
        {/* Profile Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end h-full px-4 sm:px-6 pb-4 sm:pb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 sm:w-32 h-24 sm:h-32 bg-[var(--card)] rounded-full p-1">
              <Image
                src="https://picsum.photos/200/300"
                width={200}
                height={200}
                alt="Omar El-Nabalawy"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="text-white text-center sm:text-left pb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                <span>Islam Mohamed</span>
                <span className="text-lg sm:text-xl md:text-2xl">🇪🇬</span>
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-[var(--muted-foreground)] mt-1">
                Senior Product Designer at Master Works | Riyadh
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-3 pb-2">
            <Button variant="outline" size="sm" className="">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="p-4 sm:p-6">
        <div className="max-w-full sm:max-w-4xl mx-auto">
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base leading-relaxed mb-4">
            👋 Hi, I'm Omar El-Nabalawy — a Senior UI/UX & Product Designer with
            7+ years of experience crafting user-centered digital products. I've
            led design projects for SaaS platforms, government portals, and
            e-commerce brands across the MENA region and beyond....
          </p>
          <Button
            variant="link"
            className="p-0 text-[var(--primary)] font-medium text-sm sm:text-base"
          >
            Show more
          </Button>

          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-6">
            <Button
              variant="outline"
              size="sm"
              className="p-2 bg-transparent border-[var(--border)]"
            >
              <Linkedin className="w-4 h-4 text-[var(--primary)]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2 bg-transparent border-[var(--border)]"
            >
              <Globe className="w-4 h-4 text-[var(--primary)]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
