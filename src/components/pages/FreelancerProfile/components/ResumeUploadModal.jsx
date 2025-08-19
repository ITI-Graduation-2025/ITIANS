"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Upload, FileText, CheckCircle } from "lucide-react";

export const ResumeUploadModal = ({ 
  isOpen, 
  onClose, 
  onResumeUpload 
}) => {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid document file (PDF, DOC, or DOCX)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      // Create a synthetic event object for the upload function
      const syntheticEvent = {
        target: {
          files: [selectedFile]
        }
      };
      
      await onResumeUpload(syntheticEvent);
      toast.success("Resume uploaded successfully!");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "Failed to upload resume.";
      toast.error(errorMessage);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().endsWith('.pdf')) {
      return '📄';
    } else if (fileName?.toLowerCase().endsWith('.doc') || fileName?.toLowerCase().endsWith('.docx')) {
      return '📝';
    }
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Upload Resume</h2>
            <p className="text-slate-600 text-sm">Add your professional resume</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedFile ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Drop your resume here
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  or click to browse files
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Choose File
                </button>
                <p className="text-xs text-slate-400 mt-4">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Tips for a great resume:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep it under 2 pages</li>
                  <li>• Use clear, professional formatting</li>
                  <li>• Include your latest experience</li>
                  <li>• Make sure it's up to date</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected File */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">File Selected</p>
                    <p className="text-sm text-slate-600">Ready to upload</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Upload className="w-5 h-5" />
                Upload Resume
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
