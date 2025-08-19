import { FaCertificate } from "react-icons/fa";
import { FiEdit, FiPlus, FiDownload, FiEye } from "react-icons/fi";

export const Certificates = ({ certificates, setIsModalOpen, isOwner }) => {
  const certificatesArray = Array.isArray(certificates) ? certificates : [];
  
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/90 rounded-2xl flex items-center justify-center shadow-lg">
              <FaCertificate className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Certificates</h2>
              <p className="text-slate-600 text-sm">
                {certificatesArray.length} certificate{certificatesArray.length !== 1 ? 's' : ''} • Professional achievements
              </p>
            </div>
          </div>
          
          {isOwner && (
            <button
              onClick={() => setIsModalOpen("certificates")}
              className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-200 border border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md"
              title="Edit certificates"
            >
              {certificatesArray.length > 0 ? (
                <>
                  <FiEdit size={16} />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>

        {certificatesArray.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {certificatesArray.map((cert, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-5 hover:from-primary/5 hover:to-primary/10 hover:border-primary/200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <FaCertificate className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors text-lg">
                        {cert.title || cert}
                      </h3>
                      {cert.fileUrl && (
                        <div className="flex gap-2 ml-3">
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View certificate"
                          >
                            <FiEye size={16} />
                          </a>
                          <a
                            href={cert.fileUrl}
                            download={cert.fileName || "certificate"}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download certificate"
                          >
                            <FiDownload size={16} />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {cert.year && (
                        <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                          Issued in {cert.year}
                        </p>
                      )}
                      {cert.issuer && (
                        <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                          by {cert.issuer}
                        </p>
                      )}
                      {cert.fileUrl && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                            {cert.fileName || "File attached"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Show image preview if it's an image certificate */}
                {cert.fileUrl && cert.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                  <div className="mt-3 flex justify-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-slate-200">
                      <img 
                        src={cert.fileUrl} 
                        alt="Certificate preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
        ) : (
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FaCertificate className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Certificates Yet</h3>
            <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
              {isOwner 
                ? "Add your professional certificates to showcase your qualifications and expertise"
                : "This freelancer hasn't added any certificates yet"
              }
            </p>
            
            {isOwner && (
              <button
                onClick={() => setIsModalOpen("certificates")}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Certificate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
