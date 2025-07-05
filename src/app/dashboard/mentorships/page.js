"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Check,
  X,
  Eye,
  ExternalLink,
} from "lucide-react";
import { mockMentorshipOffers, mockMentorshipSessions } from "@/lib/mock-data";

export default function MentorshipsPage() {
  const [offers, setOffers] = useState(mockMentorshipOffers);
  const [sessions, setSessions] = useState(mockMentorshipSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.menteeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApproveOffer = (offerId) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, status: "Approved" } : offer,
      ),
    );
  };

  const handleRejectOffer = (offerId) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, status: "Rejected" } : offer,
      ),
    );
  };

  const getOfferStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSessionStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Mentorships Management
          </h2>
        </div>

        <Tabs defaultValue="offers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="offers">Mentorship Offers</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Offers</CardTitle>
                <CardDescription>
                  Approve or reject mentorship offers from mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors or fields..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Offers Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOffers.map((offer) => (
                        <TableRow key={offer.id}>
                          <TableCell className="font-medium">
                            {offer.mentorName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{offer.field}</Badge>
                          </TableCell>
                          <TableCell>{offer.availability}</TableCell>
                          <TableCell>
                            {offer.isPaid ? (
                              <Badge className="bg-green-100 text-green-800">
                                ${offer.price}/session
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800">
                                Free
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {getOfferStatusBadge(offer.status)}
                          </TableCell>
                          <TableCell>{offer.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                {offer.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleApproveOffer(offer.id)
                                      }
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRejectOffer(offer.id)
                                      }
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Sessions</CardTitle>
                <CardDescription>
                  Monitor scheduled and completed mentorship sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Sessions Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Mentee</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Meeting Link</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            {session.mentorName}
                          </TableCell>
                          <TableCell>{session.menteeName}</TableCell>
                          <TableCell>{session.date}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Join
                              </a>
                            </Button>
                          </TableCell>
                          <TableCell>
                            {getSessionStatusBadge(session.status)}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {session.feedback || "No feedback yet"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Feedback
                                </DropdownMenuItem>
                                {session.status === "Scheduled" && (
                                  <DropdownMenuItem className="text-red-600">
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel Session
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
