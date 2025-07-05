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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  Eye,
  Archive,
  MessageCircle,
} from "lucide-react";
import { mockChats } from "@/lib/mock-data";

export default function ChatsPage() {
  const [chats, setChats] = useState(mockChats);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.participantNames.some((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && !chat.isArchived;
  });

  const handleArchiveChat = (chatId) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, isArchived: true } : chat,
      ),
    );
  };

  // Mock chat messages for the selected chat
  const mockMessages = [
    {
      id: "1",
      sender: "Ahmed Hassan",
      message: "Hi Sarah, I'm interested in learning React. Can you help me?",
      timestamp: "2024-01-28 10:00",
      isFromMentor: false,
    },
    {
      id: "2",
      sender: "Sarah Mohamed",
      message:
        "Of course! I'd be happy to help you with React. What's your current experience level?",
      timestamp: "2024-01-28 10:05",
      isFromMentor: true,
    },
    {
      id: "3",
      sender: "Ahmed Hassan",
      message: "I have basic JavaScript knowledge but I'm new to React.",
      timestamp: "2024-01-28 10:10",
      isFromMentor: false,
    },
    {
      id: "4",
      sender: "Sarah Mohamed",
      message:
        "Perfect! Let's start with the fundamentals. I'll schedule a session for this weekend.",
      timestamp: "2024-01-28 10:15",
      isFromMentor: true,
    },
    {
      id: "5",
      sender: "Ahmed Hassan",
      message: "Thank you for the mentorship session!",
      timestamp: "2024-01-28 14:30",
      isFromMentor: false,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Chats Management
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Conversations</CardTitle>
            <CardDescription>
              Monitor conversations between users and mentors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Chats Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participants</TableHead>
                    <TableHead>Last Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChats.map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {chat.participantNames.join(" & ")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {chat.participantNames.length} participants
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={chat.lastMessage}>
                          {chat.lastMessage}
                        </div>
                      </TableCell>
                      <TableCell>{chat.timestamp}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedChat(chat);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Chat History
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Chat History</DialogTitle>
                                  <DialogDescription>
                                    Conversation between{" "}
                                    {chat.participantNames.join(" and ")}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  {mockMessages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${message.isFromMentor ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-[70%] rounded-lg p-3 ${
                                          message.isFromMentor
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-900"
                                        }`}
                                      >
                                        <div className="font-medium text-sm mb-1">
                                          {message.sender}
                                        </div>
                                        <div>{message.message}</div>
                                        <div className="text-xs mt-2 opacity-70">
                                          {message.timestamp}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem
                              onClick={() => handleArchiveChat(chat.id)}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredChats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active conversations found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
