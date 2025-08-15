"use client";
import { SectionCard } from "./SectionCard";
import { FaBriefcase } from "react-icons/fa";

export const InProgressJobs = ({ inProgressJobs = [], currentJob, isOwner, setIsModalOpen }) => {
  const hasArrayItems = Array.isArray(inProgressJobs) && inProgressJobs.length > 0;
  const hasCurrentJob = typeof currentJob === "string" && currentJob.trim().length > 0;

  return (
    <SectionCard
      icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
      title="In Progress Jobs"
      value={
        hasArrayItems ? (
          inProgressJobs.map((job, i) => (
            <div key={i} className="text-sm">
              {job.role || job.title || "Ongoing role"}
              {job.company ? ` at ${job.company}` : ""}
              {job.date ? ` (${job.date})` : ""}
              {job.details ? <><br />{job.details}</> : null}
              {job.expectedEnd ? (
                <div className="text-xs text-gray-600">Expected completion: {job.expectedEnd}</div>
              ) : null}
            </div>
          ))
        ) : hasCurrentJob ? (
          <div className="text-sm">{currentJob}</div>
        ) : (
          <div className="text-sm">No in-progress jobs</div>
        )
      }
   
    />
  );
};


