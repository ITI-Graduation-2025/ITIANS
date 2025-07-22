"use client";

import { TabsContent } from "@/components/ui/tabs";

export function ReviewsTab() {
  return (
    <TabsContent value="reviews" className="p-4 sm:p-6">
      <div className="text-center py-6 sm:py-8">
        <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
          Reviews content would go here...
        </p>
      </div>
    </TabsContent>
  );
}
