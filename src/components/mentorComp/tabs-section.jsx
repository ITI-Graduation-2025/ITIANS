"use client";

import { useUserContext } from "@/context/userContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { DashboardTab } from "./(tabs)/dashboard-tab";
import { ReviewsTab } from "./(tabs)/reviews-tap";
import { AchievementsTab } from "./achievements-tab";
import { GroupSessionsTab } from "./(tabs)/group-sessions-tab";
import { OverviewTab } from "./(tabs)/overview-tab";

export function TabsSection() {
  const { user } = useUserContext();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="border-t border-[var(--border)]">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-[var(--card)] border-b border-[var(--border)] rounded-none h-auto p-0">
          <TabsTrigger
            value="overview"
            className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="border-b-2 border-transparent data-[state=active]:bg-secondary rounded-none py-3 sm:py-4 text-[var(--foreground)] text-xs sm:text-sm"
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
          {user.role === "mentor" && (
            <TabsTrigger
              value="dashboard"
              className="border-b-2 border-transparent data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4 data-[state=active]:text-white text-xs sm:text-sm"
            >
              Dashboard
            </TabsTrigger>
          )}
        </TabsList>

        <OverviewTab />
        <ReviewsTab />
        <AchievementsTab />
        <GroupSessionsTab />
        {user.role === "mentor" && <DashboardTab />}
      </Tabs>
    </div>
  );
}
