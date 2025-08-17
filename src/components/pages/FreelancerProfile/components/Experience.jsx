"use client";
import { FaBriefcase } from "react-icons/fa";
import { FiEdit, FiPlus, FiCalendar, FiMapPin } from "react-icons/fi";

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

  const totalExperience = () => {
    if (experienceYears && experienceMonths) {
      return `${experienceYears} years, ${experienceMonths} months`;
    } else if (experienceYears) {
      return `${experienceYears} years`;
    } else if (experienceMonths) {
      return `${experienceMonths} months`;
    }
    return "No experience";
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-12 translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
              <FaBriefcase className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Work Experience</h2>
              <p className="text-slate-600 text-sm">
                {hasExperiences ? `${workExperiences.length} position${workExperiences.length !== 1 ? 's' : ''}` : 'No positions'} • {totalExperience()}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <button
              onClick={() => setIsModalOpen && setIsModalOpen("experience")}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-200 border border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md"
              title="Edit experience"
            >
              {hasExperiences ? (
                <>
                  <FiEdit size={18} />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <FiPlus size={18} />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>

        {hasExperiences ? (
          <div className="space-y-6">
            {workExperiences.map((exp, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 hover:from-primary/5 hover:to-primary/10 hover:border-primary/200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <FaBriefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {exp.jobTitle || "Role"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        {exp.company && (
                          <div className="flex items-center gap-2">
                            <FiMapPin className="w-4 h-4 text-primary" />
                            <span>{exp.company}</span>
                          </div>
                        )}
                        {(exp.startDate || exp.endDate) && (
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-primary" />
                            <span>
                              {exp.startDate || ""}
                              {exp.endDate ? ` - ${exp.endDate}` : " - Present"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {exp.tasks && (
                      <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-slate-200">
                        {exp.tasks}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FaBriefcase className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Work Experience Yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              {isOwner 
                ? "Add your work experience to showcase your professional background and expertise"
                : "This freelancer hasn't added any work experience yet"
              }
            </p>
            
            {isOwner && (
              <button
                onClick={() => setIsModalOpen && setIsModalOpen("experience")}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


