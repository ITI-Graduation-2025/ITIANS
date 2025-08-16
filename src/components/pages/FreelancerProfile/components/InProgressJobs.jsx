"use client";
import { FaBriefcase } from "react-icons/fa";
import { FiClock, FiMapPin, FiCalendar, FiTarget } from "react-icons/fi";

export const InProgressJobs = ({ inProgressJobs = [], currentJob, isOwner, setIsModalOpen }) => {
  const hasArrayItems = Array.isArray(inProgressJobs) && inProgressJobs.length > 0;
  const hasCurrentJob = typeof currentJob === "string" && currentJob.trim().length > 0;
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
            <h2 className="text-2xl font-bold text-slate-800">Active Projects</h2>
            <p className="text-slate-600 text-sm">
              {hasArrayItems ? `${jobsArray.length} ongoing` : hasCurrentJob ? 'Currently working' : 'No active projects'} • In progress
            </p>
          </div>
        </div>

        {hasArrayItems ? (
          <div className="space-y-4">
            {jobsArray.map((job, index) => (
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
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-600 mb-3">
                      {job.company && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4 text-primary" />
                          <span>{job.company}</span>
                        </div>
                      )}
                      {job.date && (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-primary" />
                          <span>Started: {job.date}</span>
                        </div>
                      )}
                    </div>
                    
                    {job.details && (
                      <div className="text-slate-700 text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-200 mb-3">
                        {job.details}
                      </div>
                    )}
                    
                    {job.expectedEnd && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                        <FiTarget className="w-4 h-4 text-blue-600" />
                        <span>Expected completion: {job.expectedEnd}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
        ) : hasCurrentJob ? (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <FaBriefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Current Project</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{currentJob}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Active Projects</h3>
            <p className="text-slate-500 text-sm">
              {isOwner 
                ? "Start a new project to showcase your ongoing work"
                : "This freelancer isn't working on any projects currently"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


