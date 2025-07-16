"use client";

import { useContext, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { UsersContext } from "@/context/usersContext";
import { useSession } from "next-auth/react";

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

export function TabsSection() {
  const [newSession, setNewSession] = useState({
    date: "",
    time: "",
    duration: "",
  });

  const { users } = useContext(UsersContext);
  const { data, status } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New session:", newSession);
    setNewSession({ date: "", time: "", duration: "" });
  };

  return (
    <div className="border-t border-[var(--border)]">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-[var(--card)] border-b border-[var(--border)] rounded-none h-auto p-0">
          <TabsTrigger
            value="overview"
            className="border-b-2 border-transparent  data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4  data-[state=active]:text-white text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="border-b-2 border-transparent  data-[state=active]:bg-secondary rounded-none py-3 sm:py-4 text-[var(--foreground)] text-xs sm:text-sm"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="border-b-2 border-transparent  data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4  data-[state=active]:text-white text-xs sm:text-sm"
          >
            <span>Achievements</span>
            <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="group-sessions"
            className="border-b-2 border-transparent  data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4  data-[state=active]:text-white text-xs sm:text-sm"
          >
            Group sessions
          </TabsTrigger>
          {data?.user?.role === "mentor" && (
            <TabsTrigger
              value="dashboard"
              className="border-b-2 border-transparent  data-[state=active]:bg-sidebar-primary rounded-none py-3 sm:py-4  data-[state=active]:text-white text-xs sm:text-sm"
            >
              Dashboard
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="p-4 sm:p-6">
          {/* Background Section */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-4 sm:mb-6">
                Background
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] mb-2 sm:mb-3">
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                      Product
                    </Badge>
                    <Badge className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                      Design
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      +1
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] mb-2 sm:mb-3">
                    Disciplines
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      UX Design
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Service Design
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      +2
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] mb-2 sm:mb-3">
                    Fluent in
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      English
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                    >
                      Standard Arabic
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold flex items-center space-x-2 text-[var(--foreground)]">
                  <span>Experience</span>
                  <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
                    3
                  </Badge>
                </h3>
                <Button
                  variant="link"
                  className="text-[var(--primary)] text-xs sm:text-sm mt-2 sm:mt-0"
                >
                  View all
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-5 sm:w-6 h-5 sm:h-6 bg-[var(--accent)] rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg text-[var(--foreground)]">
                          Senior Product Designer
                        </h4>
                        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                          Master Works | Riyadh
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs border-[var(--border)] text-[var(--foreground)] mt-2 sm:mt-0"
                      >
                        JUN 2024 - PRESENT
                      </Badge>
                    </div>
                    <div className="mt-2 sm:mt-3 text-[var(--muted-foreground)] text-xs sm:text-sm space-y-2">
                      <p>
                        • Led UX for multiple large Saudi government digital
                        platforms, making key e-services simpler for a
                        nationwide audience.
                      </p>
                      <p>• Defined information architecture and in...</p>
                      <Button
                        variant="link"
                        className="p-0 text-[var(--primary)] text-xs sm:text-sm"
                      >
                        See more
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold flex items-center space-x-2 mb-4 sm:mb-6 text-[var(--foreground)]">
                <span>Education</span>
                <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
                  1
                </Badge>
              </h3>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[var(--secondary)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--secondary)] text-lg sm:text-xl">
                    🎓
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-base sm:text-lg text-[var(--foreground)]">
                    B.Sc. Computer Science
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                    Misr University for Science & Technology • 2014 - 2018
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
              Reviews content would go here...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
              Achievements content would go here...
            </p>
          </div>
        </TabsContent>

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

        <TabsContent value="dashboard" className="p-4 sm:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Calendar View */}
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
                            <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
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

            {/* Add Session Form */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--foreground)]">
                Add New Availability
              </h3>
              <Card className="bg-[var(--card)] border-[var(--border)]">
                <CardContent className="pt-4 sm:pt-6">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-3 sm:space-y-4"
                  >
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

            {/* Booked Sessions */}
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
                            session.status === "Confirmed"
                              ? "default"
                              : "secondary"
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
      </Tabs>
    </div>
  );
}
