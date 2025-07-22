"use client";

import { TabsContent } from "@/components/ui/tabs";

export function AchievementsTab() {
  return (
    <TabsContent value="achievements" className="p-4 sm:p-6">
      <div className="text-center py-6 sm:py-8">
        <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
          Achievements content would go here...
        </p>
      </div>
    </TabsContent>
  );
}
