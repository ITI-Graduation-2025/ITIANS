"use client";

import { FiEdit, FiStar, FiPlus } from "react-icons/fi";

export const Skills = ({ skills, isOwner, setIsModalOpen }) => {
  // Ensure skills is always an array and handle different data structures
  const skillsArray = Array.isArray(skills) ? skills : [];
  
  // Normalize skills data structure for consistent display
  const normalizedSkills = skillsArray.map(skill => {
    if (typeof skill === 'string') return skill;
    if (skill && typeof skill === 'object') return skill.value || skill.name || skill.title || 'Unknown Skill';
    return 'Unknown Skill';
  }).filter(skill => skill !== 'Unknown Skill');
  
  // Helper function to get skill display value (now simplified since we normalize above)
  const getSkillValue = (skill) => {
    return skill; // Skills are now normalized to strings
  };
  
  if (!normalizedSkills || normalizedSkills.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
                <FiStar className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Skills</h2>
            </div>
            {isOwner && (
              <button
                onClick={() => setIsModalOpen("skills")}
                className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-200 border border-primary/20 hover:border-primary/30 font-medium"
                title="Add skills"
              >
                <FiPlus size={16} />
                <span>Add Skills</span>
              </button>
            )}
          </div>
          
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <FiStar className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No skills added yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Add your technical skills to showcase your expertise and attract potential clients
            </p>
            {isOwner && (
              <button
                onClick={() => setIsModalOpen("skills")}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Your First Skill
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
              <FiStar className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Skills</h2>
              <p className="text-slate-600 text-sm">
                {normalizedSkills.length} skill{normalizedSkills.length !== 1 ? 's' : ''} • Technical expertise
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen("skills")}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-200 border border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md"
              title="Edit skills"
            >
              <FiEdit size={16} />
              <span>Edit Skills</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {normalizedSkills.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-3 hover:from-primary/5 hover:to-primary/10 hover:border-primary/200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FiStar className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-800 transition-colors text-sm">
                  {getSkillValue(skill)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
