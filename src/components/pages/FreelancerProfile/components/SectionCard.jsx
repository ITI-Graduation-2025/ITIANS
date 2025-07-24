"use client";
import { FiEdit } from "react-icons/fi";

export const SectionCard = ({ icon, title, value, onEdit, editable }) => {
  return (
    <div className="py-6 border-b border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-[#B71C1C]">{title}</h2>
        </div>
        {editable && onEdit && (
          <button
            className="text-gray-400 hover:text-[#B71C1C]"
            onClick={onEdit}
          >
            <FiEdit />
          </button>
        )}
      </div>
      <div className="mt-2 text-black">{value}</div>
    </div>
  );
};
