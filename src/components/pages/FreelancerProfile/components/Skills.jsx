"use client";

import { FiEdit, FiStar, FiPlus } from "react-icons/fi";

export const Skills = ({ skills, isOwner, setIsModalOpen }) => {
  // Ensure skills is always an array and handle different data structures
  const skillsArray = Array.isArray(skills) ? skills : [];
  
  if (!skillsArray || skillsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#B71C1C] to-red-600 rounded-lg flex items-center justify-center">
              <FiStar className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#B71C1C]">Skills</h2>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen("skills")}
              className="text-[#B71C1C] hover:text-[#B71C1C]/80 transition-colors flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-red-50"
              title="Add skills"
            >
              <FiPlus size={16} />
              <span className="text-sm font-medium">Add Skills</span>
            </button>
          )}
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiStar className="text-gray-400 w-10 h-10" />
          </div>
          <p className="text-gray-600 text-lg font-semibold mb-2">No skills added yet</p>
          <p className="text-gray-400 text-sm mb-6">Add your technical skills to showcase your expertise</p>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen("skills")}
              className="px-6 py-3 bg-gradient-to-r from-[#B71C1C] to-red-600 text-white rounded-lg hover:from-[#B71C1C]/90 hover:to-red-600/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
            >
              Add Your First Skill
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#B71C1C] to-red-600 rounded-lg flex items-center justify-center">
            <FiStar className="text-white w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#B71C1C]">Skills</h2>
          <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border">
            {skillsArray.length} skill{skillsArray.length !== 1 ? 's' : ''}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={() => setIsModalOpen("skills")}
            className="text-[#B71C1C] hover:text-[#B71C1C]/80 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 border border-[#B71C1C]/20 hover:border-[#B71C1C]/40"
            title="Edit skills"
          >
            <FiEdit size={16} />
            <span className="text-sm font-medium">Edit Skills</span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {skillsArray.map((skill, index) => (
          <span
            key={index}
            className="bg-gradient-to-r from-[#B71C1C] to-red-600 text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-default flex items-center gap-2 group"
          >
            <FiStar className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
            {skill.value || skill}
          </span>
        ))}
      </div>
    </div>
  );
};
