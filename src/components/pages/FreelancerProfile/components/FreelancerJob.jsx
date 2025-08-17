"use client";
import { markJobAsUnderReview } from "@/services/jobServices";
import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { FiCalendar, FiDollarSign, FiMapPin, FiTarget } from "react-icons/fi";

import { toast } from "sonner";

export const FreelancerJob = ({ job, isOwner, index ,currentUserId }) => {

  const [isCompleting, setIsCompleting] = useState(false);

  const handleMarkAsUnderReview = async (
    jobId,
    jobTitle,
    companyName,
    companyId,
  ) => {
    if (!isOwner) return;
console.log(job);

    setIsCompleting(true);
    try {
      await markJobAsUnderReview(jobId, currentUserId, companyId, jobTitle);
      toast.success(
        "Job marked as under review! Company will review and approve.",
      );
      
    } catch (error) {
      console.error("Error marking job as under review:", error);
      toast.error("Failed to mark job as under review. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };
  return (
    <>
      <div
        key={index}
        className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-5 hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
            <FaBriefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                {job.role || job.title || "Ongoing Role"}
              </h3>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <FiTarget className="w-4 h-4" />
                <span className="text-sm">{job.status}</span>
              </div>
              {(job.type || job.level) && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {job.type && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  )}
                  {job.level && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {job.level}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-600 mb-3">
              {job.company && (
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-primary" />
                  <span>{job.company}</span>
                </div>
              )}
              {job.startedAt && (
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-primary" />
                  <span>
                    Started: {new Date(job.startedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-primary" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>

            {job.description && (
              <div className="text-slate-700 text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-200 mb-3">
                <strong>Description:</strong> {job.description}
              </div>
            )}

            {job.requirements && (
              <div className="text-slate-700 text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-200 mb-3">
                <strong>Requirements:</strong> {job.requirements}
              </div>
            )}

            {job.expectedEnd && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                <FiTarget className="w-4 h-4 text-blue-600" />
                <span>
                  Expected completion:{" "}
                  {new Date(job.expectedEnd).toLocaleDateString()}
                </span>
              </div>
            )}

            {isOwner && job.status === "inProgress" && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={() =>
                    handleMarkAsUnderReview(
                      job.id,
                      job.title,
                      job.company,
                      job.companyId,
                    )
                  }
                  disabled={isCompleting}
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isCompleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiTarget className="w-4 h-4" />
                  {isCompleting ? "Marking..." : "Mark as under review"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerJob;
