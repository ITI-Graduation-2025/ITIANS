"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ReviewsTab } from "./(tabs)/reviews-tap";
import { AchievementsTab } from "./achievements-tab";
import { GroupSessionsTab } from "./(tabs)/group-sessions-tab";
import { OverviewTab } from "./(tabs)/overview-tab";
import { DashboardTab } from "./(tabs)/dashboard-tab";

export function TabsSection({ mentor, isOwner }) {
  if (!mentor) {
    return <div>Mentor not found</div>;
  }

  return (
    <div className="border-t border-[var(--border)]">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-2 ${isOwner ? "sm:grid-cols-5" : "sm:grid-cols-4"} bg-[var(--card)] border-b border-[var(--border)] rounded-none h-auto p-0`}
        >
          <TabsTrigger
            value="overview"
            className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
          >
            <span>Achievements</span>
            <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="group-sessions"
            className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
          >
            Group sessions
          </TabsTrigger>
          {isOwner && mentor.role === "mentor" && (
            <TabsTrigger
              value="dashboard"
              className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
            >
              Dashboard
            </TabsTrigger>
          )}
        </TabsList>

        <OverviewTab mentor={mentor} />
        <ReviewsTab mentorId={mentor.id} />
        <AchievementsTab mentorId={mentor.id} />
        <GroupSessionsTab mentorId={mentor.id} />
        {isOwner && mentor.role === "mentor" && (
          <DashboardTab mentor={mentor} isOwner={isOwner} />
        )}
      </Tabs>
    </div>
  );
}
