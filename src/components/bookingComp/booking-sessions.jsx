"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BookingSessions({ mentors, currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    let filtered = mentors.filter((mentor) => {
      const matchesSearch =
        mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || mentor.category === selectedCategory;
      const matchesExperience =
        selectedExperience === "all" ||
        mentor.experienceLevel === selectedExperience;

      return matchesSearch && matchesCategory && matchesExperience;
    });

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "price":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mentors, searchQuery, selectedCategory, selectedExperience, sortBy]);

  const categories = [
    "all",
    "technology",
    "business",
    "design",
    "marketing",
    "finance",
    "healthcare",
    "education",
  ];

  const experienceLevels = ["all", "junior", "mid-level", "senior", "expert"];

  const sortOptions = [
    { value: "rating", label: "Highest Rating" },
    { value: "experience", label: "Most Experienced" },
    { value: "name", label: "Name A-Z" },
    { value: "price", label: "Price Low-High" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#200122] to-[#6f0000] rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Perfect Mentor Session
          </h1>
          <p className="text-xl text-gray-200 mb-6">
            Connect with industry experts and accelerate your career growth
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-5 h-5" />
              <span>{filteredMentors.length} Available Mentors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <BookOpen className="w-5 h-5" />
              <span>Expert-Led Sessions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span>Flexible Scheduling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Filter */}
            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all"
                      ? "All Levels"
                      : level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No mentors found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MentorCard({ mentor, currentUser }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative">
        {/* Background Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {mentor.category || "Technology"}
            </Badge>
          </div>
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-12 left-6">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={mentor.profileImage} alt={mentor.name} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {mentor.name?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1">
          {getRatingStars(mentor.rating)}
          <span className="text-sm font-semibold text-gray-800 ml-1">
            {mentor.rating?.toFixed(1) || "N/A"}
          </span>
        </div>
      </div>

      <CardContent className="pt-16 pb-6">
        {/* Mentor Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#B71C1C] transition-colors">
            {mentor.name}
          </h3>
          <p className="text-gray-600 font-medium mb-1">
            {mentor.jobTitle} at {mentor.company}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            {mentor.yearsOfExperience || "5+"} years of experience
          </p>
        </div>

        {/* Bio Preview */}
        {mentor.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {mentor.bio}
          </p>
        )}

        {/* Skills/Tags */}
        {mentor.skills && mentor.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#B71C1C]">
              {mentor.sessionsCompleted || 0}
            </p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#B71C1C]">
              {mentor.students || 0}
            </p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#B71C1C]">
              ${mentor.hourlyRate || 0}
            </p>
            <p className="text-xs text-gray-500">Per Hour</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-[#B71C1C] hover:bg-[#8B0000] transition-colors">
                Book Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book Session with {mentor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Ready to start your learning journey? Book a session with{" "}
                  {mentor.name} now!
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="px-4"
            onClick={() => window.open(`/mentor/${mentor.id}`, "_blank")}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
