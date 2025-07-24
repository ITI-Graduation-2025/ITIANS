import { FaCertificate } from "react-icons/fa";
import { SectionCard } from "./SectionCard";

export const Certificates = ({ certificates, setIsModalOpen, isOwner }) => {
  return (
    <SectionCard
      icon={<FaCertificate className="text-[#B71C1C] text-xl" />}
      title="Certificates"
      value={
        certificates.length ? (
          certificates.map((c, i) => (
            <div key={i} className="text-sm">
              {c.title} {c.year && `(${c.year})`}
            </div>
          ))
        ) : (
          <div className="text-sm">No certificates</div>
        )
      }
      onEdit={isOwner ? () => setIsModalOpen("certificates") : undefined}
      editable={isOwner}
    />
  );
};
