"use client";
import { SectionCard } from "./SectionCard";
import { FaBriefcase } from "react-icons/fa";

export const Experience = ({
  workExperiences = [],
  experienceYears,
  experienceMonths,
  isOwner,
  setIsModalOpen,
}) => {
  const hasExperiences = Array.isArray(workExperiences) && workExperiences.length > 0;
  const hasTotals =
    (typeof experienceYears === "number" && experienceYears > 0) ||
    (typeof experienceMonths === "number" && experienceMonths > 0);

  return (
    <SectionCard
      icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
      title="Experience"
      value={
        hasExperiences ? (
          workExperiences.map((exp, i) => (
            <div key={i} className="text-sm">
              {exp.jobTitle || "Role"}
              {exp.company ? ` at ${exp.company}` : ""}
              {(exp.startDate || exp.endDate) && (
                <span className="text-xs text-gray-600"> {`(${exp.startDate || ""}${exp.endDate ? ` - ${exp.endDate}` : ""})`}</span>
              )}
              {exp.tasks && (
                <div className="text-xs text-gray-700 mt-1 whitespace-pre-line">{exp.tasks}</div>
              )}
            </div>
          ))
        ) : hasTotals ? (
          <div className="text-sm">
            {(experienceYears || 0) > 0 ? `${experienceYears} years` : ""}
            {(experienceMonths || 0) > 0 ? ` ${(experienceMonths || 0)} months` : ""}
          </div>
        ) : (
          <div className="text-sm">No experience added</div>
        )
      }
      editable={isOwner}
      onEdit={isOwner ? () => setIsModalOpen && setIsModalOpen("experience") : undefined}
    />
  );
};


