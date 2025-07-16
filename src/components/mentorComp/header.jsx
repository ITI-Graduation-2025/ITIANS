"use client";

import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="border-b bg-[var(--card)] sticky top-0 z-50 overflow-hidden">
      <div className="flex flex-col gap-4 md:gap-1 md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[var(--foreground)] rounded-full flex items-center justify-center">
            <span className="text-[var(--card-foreground)] text-sm font-bold">
              😊
            </span>
          </div>
          <span className="text-xl font-bold text-[var(--foreground)]">
            ITIANS
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Button
            variant="ghost"
            className="flex items-center justify-between sm:justify-start space-x-1 text-[var(--muted-foreground)]"
          >
            <span>Browse</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
            <Input
              placeholder="Search mentors"
              className="pl-10 w-full sm:max-w-xs sm:w-80 bg-[var(--muted)] border-[var(--border)] rounded-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="relative">
            <div className="w-6 h-6 bg-[var(--muted)] rounded-full"></div>
            <div className="absolute -top-1 -right-1 bg-[var(--destructive)] text-[var(--destructive-foreground)] text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </div>
          </div>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap">
            <span>📅</span>
            <span>Book session</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
