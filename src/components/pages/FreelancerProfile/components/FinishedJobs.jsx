import { SectionCard } from "./SectionCard";
import { FaBriefcase } from "react-icons/fa";

export const FinishedJobs = ({
  finishedJobs = [],
  setIsModalOpen,
  isOwner,
}) => {
  return (
    <SectionCard
      icon={<FaBriefcase className="text-[#B71C1C] text-xl" />}
      title="Finished Jobs"
      value={
        finishedJobs.length ? (
          finishedJobs.map((job, i) => (
            <div key={i} className="text-sm">
              {job.role} at {job.company} ({job.date})<br />
              {job.details} - {job.price}
            </div>
          ))
        ) : (
          <div className="text-sm">No finished jobs</div>
        )
      }
      onEdit={isOwner ? () => setIsModalOpen("work") : undefined}
      editable={isOwner}
    />
  );
};
