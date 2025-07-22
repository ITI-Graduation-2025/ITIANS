"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const mockSessions = [
  { id: 1, date: "2025-07-15", time: "10:00 AM", duration: "1h" },
  { id: 2, date: "2025-07-16", time: "2:00 PM", duration: "30m" },
  { id: 3, date: "2025-07-17", time: "9:00 AM", duration: "45m" },
];

const mockBookedSessions = [
  { id: 1, title: "UX Design Intro", date: "2025-07-15", status: "Confirmed" },
  { id: 2, title: "Product Strategy", date: "2025-07-16", status: "Pending" },
  { id: 3, title: "Career Guidance", date: "2025-07-17", status: "Confirmed" },
];

export function DashboardTab() {
  const [newSession, setNewSession] = useState({
    date: "",
    time: "",
    duration: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New session:", newSession);
    setNewSession({ date: "", time: "", duration: "" });
  };

  return (
    <TabsContent value="dashboard" className="p-4 sm:p-6">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            Session Schedule
          </h3>
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg text-[var(--foreground)]">
                Available Time Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:gap-3">
                {mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border rounded-lg border-[var(--border)]"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs sm:text-sm">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-[var(--foreground)]">
                          {session.date}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                        <span className="text-[var(--foreground)]">
                          {session.time}
                        </span>
                      </span>
                      <Badge
                        variant="outline"
                        className="border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                      >
                        {session.duration}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 sm:mt-0 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            Add New Availability
          </h3>
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardContent className="pt-4 sm:pt-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="date"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSession.date}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          date: e.target.value,
                        })
                      }
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="time"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSession.time}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          time: e.target.value,
                        })
                      }
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="duration"
                      className="text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 1h, 30m"
                      value={newSession.duration}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          duration: e.target.value,
                        })
                      }
                      className="border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 text-sm sm:text-base"
                >
                  Add Availability
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
            Booked Sessions
          </h3>
          <div className="grid gap-3 sm:gap-4">
            {mockBookedSessions.map((session) => (
              <Card
                key={session.id}
                className="bg-[var(--card)] border-[var(--border)]"
              >
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <h4 className="font-medium text-base sm:text-lg text-[var(--foreground)]">
                        {session.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        {session.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        session.status === "Confirmed" ? "default" : "secondary"
                      }
                      className={
                        session.status === "Confirmed"
                          ? "mt-2 sm:mt-0 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs sm:text-sm"
                          : "mt-2 sm:mt-0 bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs sm:text-sm"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
