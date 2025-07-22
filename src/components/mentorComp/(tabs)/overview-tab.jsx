"use client";

import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function OverviewTab() {
  const { user } = useUserContext();
  const [openExperience, setOpenExperience] = useState(null);
  const [openEducation, setOpenEducation] = useState(null);

  if (!user) {
    return (
      <TabsContent value="overview" className="p-4 sm:p-6">
        <div>User not found</div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="overview" className="p-4 sm:p-6">
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
                  {user.generalSpecialization}
                </Badge>
                <Badge className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/90 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {user.specificSpecialization}
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
                  {user.customGeneralSpecialization ||
                    user.generalSpecialization}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] mb-2 sm:mb-3">
                Fluent in
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-2 sm:px-3 py-1 border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm"
                  >
                    {lang.language} ({lang.proficiency})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center space-x-2 text-[var(--foreground)]">
              <span>Experience</span>
              <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
                {user.workExperiences.length}
              </Badge>
            </h3>
            {user.workExperiences.length > 1 && (
              <Dialog
                open={openExperience === "all"}
                onOpenChange={(open) => setOpenExperience(open ? "all" : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-[var(--primary)] text-xs sm:text-sm mt-2 sm:mt-0"
                  >
                    View all
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-[var(--card)] border-[var(--border)] rounded-lg shadow-lg p-0">
                  <div className="bg-gradient-to-r from-[#200122] to-[#6f0000] p-4 flex justify-between items-center">
                    <DialogTitle className="text-white text-lg font-semibold">
                      All Experiences
                    </DialogTitle>
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-[var(--primary)]"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </DialogClose>
                  </div>
                  <div
                    className="max-h-[60vh] overflow-y-auto p-4"
                    style={{
                      scrollbarColor: "#901B20 #e5e7eb",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {user.workExperiences.map((exp, index) => (
                      <div
                        key={index}
                        className="border-b border-[var(--border)] pb-4 mb-4 last:mb-0 last:border-b-0"
                      >
                        <h4 className="font-semibold text-base text-[var(--foreground)]">
                          {exp.jobTitle}
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {exp.company}
                        </p>
                        <ul className="list-disc list-inside text-sm text-[var(--muted-foreground)] mt-2">
                          {exp.tasks
                            .split(". ")
                            .map((task, i) => task && <li key={i}>{task}</li>)}
                        </ul>
                        <Badge
                          variant="outline"
                          className="text-xs border-[var(--border)] text-[var(--foreground)] mt-2"
                        >
                          {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                          {exp.endDate
                            ? format(new Date(exp.endDate), "MMM yyyy")
                            : "Present"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="space-y-4 sm:space-y-6">
            {user.workExperiences.slice(0, 1).map((exp, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-[var(--accent)] rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-[var(--foreground)]">
                        {exp.jobTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        {exp.company}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-[var(--border)] text-[var(--foreground)] mt-2 sm:mt-0"
                    >
                      {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                      {exp.endDate
                        ? format(new Date(exp.endDate), "MMM yyyy")
                        : "Present"}
                    </Badge>
                  </div>
                  <div className="mt-2 sm:mt-3 text-[var(--muted-foreground)] text-xs sm:text-sm space-y-2">
                    <p>{exp.tasks}</p>
                    <Dialog
                      open={openExperience === index}
                      onOpenChange={(open) =>
                        setOpenExperience(open ? index : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 text-[var(--primary)] text-xs sm:text-sm"
                        >
                          See more
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] rounded-lg shadow-lg p-0">
                        <div className="bg-gradient-to-r from-[#200122] to-[#6f0000] p-4 flex justify-between items-center">
                          <DialogTitle className="text-white text-lg font-semibold">
                            {exp.jobTitle}
                          </DialogTitle>
                          <DialogClose asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-[var(--primary)]"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </DialogClose>
                        </div>
                        <div
                          className="max-h-[60vh] overflow-y-auto p-4"
                          style={{
                            scrollbarColor: "#901B20 #e5e7eb",
                            scrollbarWidth: "thin",
                          }}
                        >
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {exp.company}
                          </p>
                          <ul className="list-disc list-inside text-sm text-[var(--muted-foreground)] mt-2">
                            {exp.tasks
                              .split(". ")
                              .map(
                                (task, i) => task && <li key={i}>{task}</li>,
                              )}
                          </ul>
                          <Badge
                            variant="outline"
                            className="text-xs border-[var(--border)] text-[var(--foreground)] mt-2"
                          >
                            {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                            {exp.endDate
                              ? format(new Date(exp.endDate), "MMM yyyy")
                              : "Present"}
                          </Badge>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold flex items-center space-x-2 text-[var(--foreground)]">
              <span>Education</span>
              <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] sm:text-xs">
                {user.education.length}
              </Badge>
            </h3>
            {user.education.length > 1 && (
              <Dialog
                open={openEducation === "all"}
                onOpenChange={(open) => setOpenEducation(open ? "all" : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="text-[var(--primary)] text-xs sm:text-sm mt-2 sm:mt-0"
                  >
                    View all
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-[var(--card)] border-[var(--border)] rounded-lg shadow-lg p-0">
                  <div className="bg-gradient-to-r from-[#200122] to-[#6f0000] p-4 flex justify-between items-center">
                    <DialogTitle className="text-white text-lg font-semibold">
                      All Education
                    </DialogTitle>
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-[var(--primary)]"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </DialogClose>
                  </div>
                  <div
                    className="max-h-[60vh] overflow-y-auto p-4"
                    style={{
                      scrollbarColor: "#901B20 #e5e7eb",
                      scrollbarWidth: "thin",
                    }}
                  >
                    {user.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border-b border-[var(--border)] pb-4 mb-4 last:mb-0 last:border-b-0"
                      >
                        <h4 className="font-semibold text-base text-[var(--foreground)]">
                          {edu.degree || edu.customDegree}
                        </h4>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {edu.university}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs border-[var(--border)] text-[var(--foreground)] mt-2"
                        >
                          {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                          {edu.endDate
                            ? format(new Date(edu.endDate), "MMM yyyy")
                            : "Present"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="space-y-4 sm:space-y-6">
            {user.education.slice(0, 1).map((edu, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-[var(--secondary)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--secondary)] text-lg sm:text-xl">
                    🎓
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-[var(--foreground)]">
                        {edu.degree || edu.customDegree}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                        {edu.university}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs border-[var(--border)] text-[var(--foreground)] mt-2 sm:mt-0"
                    >
                      {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                      {edu.endDate
                        ? format(new Date(edu.endDate), "MMM yyyy")
                        : "Present"}
                    </Badge>
                  </div>
                  <div className="mt-2 sm:mt-3 text-[var(--muted-foreground)] text-xs sm:text-sm space-y-2">
                    <Dialog
                      open={openEducation === index}
                      onOpenChange={(open) =>
                        setOpenEducation(open ? index : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 text-[var(--primary)] text-xs sm:text-sm"
                        >
                          See more
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] rounded-lg shadow-lg p-0">
                        <div className="bg-gradient-to-r from-[#200122] to-[#6f0000] p-4 flex justify-between items-center">
                          <DialogTitle className="text-white text-lg font-semibold">
                            {edu.degree || edu.customDegree}
                          </DialogTitle>
                          <DialogClose asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-[var(--primary)]"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </DialogClose>
                        </div>
                        <div
                          className="max-h-[60vh] overflow-y-auto p-4"
                          style={{
                            scrollbarColor: "#901B20 #e5e7eb",
                            scrollbarWidth: "thin",
                          }}
                        >
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {edu.university}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs border-[var(--border)] text-[var(--foreground)] mt-2"
                          >
                            {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                            {edu.endDate
                              ? format(new Date(edu.endDate), "MMM yyyy")
                              : "Present"}
                          </Badge>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
