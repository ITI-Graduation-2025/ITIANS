"use client";
import { FaBriefcase } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

import { FreelancerJob } from "./FreelancerJob";

export const InProgressJobs = ({
  inProgressJobs = [],
  currentJob,
  isOwner,
  setIsModalOpen,
  refetchUser,
  currentUserId,
}) => {
  console.log(inProgressJobs);

  const hasArrayItems =
    Array.isArray(inProgressJobs) && inProgressJobs.length > 0;
  const hasCurrentJob =
    typeof currentJob === "string" && currentJob.trim().length > 0;
  const jobsArray = hasArrayItems ? inProgressJobs : [];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-12 translate-x-12"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiClock className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Active Projects
            </h2>
            <p className="text-slate-600 text-sm">
              {hasArrayItems
                ? `${jobsArray.length} ongoing`
                : hasCurrentJob
                  ? "Currently working"
                  : "No active projects"}{" "}
              • In progress
            </p>
          </div>
        </div>

        {hasArrayItems ? (
          <div className="space-y-4">
            {jobsArray.map((job, index) => (
              <FreelancerJob
                key={index}
                job={job}
                isOwner={isOwner}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : hasCurrentJob ? (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaBriefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Current Project
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {currentJob}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No Active Projects
            </h3>
            <p className="text-slate-500 text-sm">
              {isOwner
                ? "Start a new project to showcase your ongoing work"
                : "This freelancer isn't working on any projects currently"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
