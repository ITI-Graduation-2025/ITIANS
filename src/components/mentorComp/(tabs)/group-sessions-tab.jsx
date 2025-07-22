"use client";

import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

const mockGroupSessions = [
  {
    id: 1,
    title: "Product Management Fundamentals",
    date: "July 20, 2025",
    time: "2:00 PM - 3:30 PM",
    participants: 12,
    maxParticipants: 15,
    price: "$25",
  },
  {
    id: 2,
    title: "UX Research Methods",
    date: "July 22, 2025",
    time: "10:00 AM - 11:30 AM",
    participants: 8,
    maxParticipants: 12,
    price: "$30",
  },
];

export function GroupSessionsTab() {
  return (
    <TabsContent value="group-sessions" className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)]">
          Upcoming Group Sessions
        </h3>
        <div className="grid gap-4">
          {mockGroupSessions.map((session) => (
            <Card
              key={session.id}
              className="bg-[var(--card)] border-[var(--border)]"
            >
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[var(--foreground)] text-base sm:text-lg">
                  <span>{session.title}</span>
                  <Badge
                    variant="outline"
                    className="mt-2 sm:mt-0 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                  >
                    {session.price}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-[var(--muted-foreground)]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{session.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participants}/{session.maxParticipants}
                      </span>
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 text-sm sm:text-base">
                  Join Session
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TabsContent>
  );
}
