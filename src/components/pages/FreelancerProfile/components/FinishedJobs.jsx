import { FaBriefcase } from "react-icons/fa";
import { FiCheckCircle, FiDollarSign, FiCalendar, FiMapPin } from "react-icons/fi";

export const FinishedJobs = ({
  finishedJobs = [],
  setIsModalOpen,
  isOwner,
}) => {
  const jobsArray = Array.isArray(finishedJobs) ? finishedJobs : [];
  
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-12 translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiCheckCircle className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Completed Projects</h2>
            <p className="text-slate-600 text-sm">
              {jobsArray.length} project{jobsArray.length !== 1 ? 's' : ''} • Successfully delivered
            </p>
          </div>
        </div>

        {jobsArray.length > 0 ? (
          <div className="space-y-4">
            {jobsArray.map((job, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-5 hover:from-green-50 hover:to-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                    <FaBriefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {job.role || "Project Role"}
                      </h3>
                      {job.price && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <FiDollarSign className="w-4 h-4" />
                          <span>{job.price}</span>
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
                      {job.date && (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-primary" />
                          <span>{job.date}</span>
                        </div>
                      )}
                    </div>
                    
                    {job.details && (
                      <div className="text-slate-700 text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-200">
                        {job.details}
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
              <FiCheckCircle className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Completed Projects Yet</h3>
            <p className="text-slate-500 text-sm">
              {isOwner 
                ? "Complete your first project to start building your portfolio"
                : "This freelancer hasn't completed any projects yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
