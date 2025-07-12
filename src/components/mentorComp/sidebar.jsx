"use client";

import {
  Home,
  Search,
  Users,
  MessageCircle,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 md:top-16 md:h-full w-full md:w-16 bg-[var(--card)] border-t md:border-t-0 md:border-r border-[var(--border)] flex md:flex-col items-center justify-around md:justify-start py-4 md:py-6 space-x-4 md:space-x-0 md:space-y-8 z-50">
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
      >
        <Home className="w-5 h-5" />
        <span className="text-xs">Home</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
      >
        <Search className="w-5 h-5" />
        <span className="text-xs">Explore</span>
      </Button>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">Journal</span>
        </Button>
        <div className="absolute -top-1 -right-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs px-1 rounded text-[10px]">
          New
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs">Messages</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
      >
        <Calendar className="w-5 h-5" />
        <span className="text-xs">Bookings</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex flex-col items-center space-y-1 h-auto p-2 text-[var(--muted-foreground)]"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-xs">More</span>
      </Button>
    </aside>
  );
}
