"use client";

import { useUserContext } from "@/context/userContext";
import { updateUser } from "@/services/userServices";
import { upload } from "@/utils/upload";
import { useEffect, useRef, useState } from "react";
import { FiTrash2, FiUpload, FiX, FiPlus } from "react-icons/fi";
import { toast } from "sonner";

export const EditModal = ({ type, onClose, refetchUser }) => {
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [originalValue, setOriginalValue] = useState(null);
  const { user , setUser} = useUserContext();
  const fileInputRef = useRef();

  useEffect(() => {
    if (type === "about") {
      setTempValue(user.bio || "");
      setOriginalValue(user.bio || "");
    } else if (type === "linkedin") {
      setTempValue(user.linkedIn || "");
      setOriginalValue(user.linkedIn || "");
    } else if (type === "github") {
      setTempValue(user.github || "");
      setOriginalValue(user.github || "");
    } else if (type === "education") {
      setTempValue(user.education || { school: "", degree: "", year: "" });
      setOriginalValue(user.education || { school: "", degree: "", year: "" });
    } else if (type === "work") {
      setTempValue(user.finishedJobs || []);
      setOriginalValue(user.finishedJobs || []);
    } else if (type === "experience") {
      setTempValue(
        user.workExperiences || [
          { jobTitle: "", company: "", startDate: "", endDate: "", tasks: "" },
        ],
      );
      setOriginalValue(
        user.workExperiences || [
          { jobTitle: "", company: "", startDate: "", endDate: "", tasks: "" },
        ],
      );
    } else if (type === "certificates") {
      // Handle both old and new certificate formats
      const userCertificates = user.certificates || [];
      const normalizedCertificates = Array.isArray(userCertificates) 
        ? userCertificates.map(cert => {
            if (typeof cert === 'string') {
              // Convert old string format to new object format
              return { title: cert, year: "", issuer: "", fileUrl: "", fileName: "" };
            }
            if (cert && typeof cert === 'object') {
              // Ensure new object format has all required fields
              return {
                title: cert.title || cert.name || cert || "",
                year: cert.year || "",
                issuer: cert.issuer || "",
                fileUrl: cert.fileUrl || cert.url || "",
                fileName: cert.fileName || cert.name || ""
              };
            }
            return { title: "", year: "", issuer: "", fileUrl: "", fileName: "" };
          })
        : [];
      
      setTempValue(normalizedCertificates);
      setOriginalValue(normalizedCertificates);
    } else if (type === "profileImage") {
      setTempValue(user.profileImage || "");
      setImagePreview(user.profileImage || null);
      setOriginalValue(user.profileImage || "");
    } else if (type === "skills") {
      const userSkills = user.skills || [];
      
      // Normalize skills data structure - convert both string and object formats to strings
      const normalizedSkills = Array.isArray(userSkills) 
        ? userSkills.map(skill => {
            if (typeof skill === 'string') return skill;
            if (skill && typeof skill === 'object') return skill.value || skill.name || skill.title || 'Unknown Skill';
            return 'Unknown Skill';
          }).filter(skill => skill !== 'Unknown Skill')
        : [];
      
      setTempValue({
        skills: normalizedSkills,
        newSkill: ""
      });
      setOriginalValue({
        skills: normalizedSkills,
        newSkill: ""
      });
    }
    setChanged(false);
  }, [type, user]);

  useEffect(() => {
    if (type === "skills") {
      // For skills, compare the actual skills array, not the entire tempValue object
      const originalSkills = originalValue?.skills || [];
      const currentSkills = tempValue?.skills || [];
      const hasChanged = JSON.stringify(originalSkills) !== JSON.stringify(currentSkills);
      setChanged(hasChanged);
    } else {
      setChanged(true);
    }
  }, [tempValue, type, originalValue]);



  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary using the upload function
      const imageUrl = await upload(e);
      setUser({
        ...user, profileImage: imageUrl
      })
      setTempValue(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setTempValue("");
    // Update local user context immediately for instant UI update
    setUser({ ...user, profileImage: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Mark as changed so user knows they have unsaved changes
    setChanged(true);
  };

  const handleRemoveCertificateFile = (certIndex) => {
    const arr = [...tempValue];
    arr[certIndex] = { ...arr[certIndex], fileUrl: "", fileName: "" };
    setTempValue(arr);
    
    // Update user context immediately for instant UI update
    setUser({ ...user, certificates: arr });
    
    // Mark as changed so user knows they have unsaved changes
    setChanged(true);
  };

  const handleCancel = () => {
    // Revert to original values
    if (type === "profileImage") {
      setUser({ ...user, profileImage: originalValue });
    } else if (type === "skills") {
      setUser({ ...user, skills: originalValue?.skills || [] });
    } else if (type === "about") {
      setUser({ ...user, bio: originalValue });
    } else if (type === "education") {
      setUser({ ...user, education: originalValue });
    } else if (type === "linkedin") {
      setUser({ ...user, linkedIn: originalValue });
    } else if (type === "github") {
      setUser({ ...user, github: originalValue });
    } else if (type === "work") {
      setUser({ ...user, finishedJobs: originalValue });
    } else if (type === "experience") {
      setUser({ ...user, workExperiences: originalValue });
    } else if (type === "certificates") {
      setUser({ ...user, certificates: originalValue });
    }
    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (type === "about") {
        await updateUser(user.id, { bio: tempValue });
        // Update local user context immediately
        setUser({ ...user, bio: tempValue });
      } else if (type === "linkedin") {
        await updateUser(user.id, { linkedIn: tempValue });
        // Update local user context immediately
        setUser({ ...user, linkedIn: tempValue });
      } else if (type === "github") {
        await updateUser(user.id, { github: tempValue });
        // Update local user context immediately
        setUser({ ...user, github: tempValue });
      } else if (type === "education") {
        await updateUser(user.id, { education: tempValue });
        // Update local user context immediately
        setUser({ ...user, education: tempValue });
      } else if (type === "work") {
        await updateUser(user.id, { finishedJobs: tempValue });
        // Update local user context immediately
        setUser({ ...user, finishedJobs: tempValue });
      } else if (type === "experience") {
        await updateUser(user.id, { workExperiences: tempValue });
        // Update local user context immediately
        setUser({ ...user, workExperiences: tempValue });
      } else if (type === "certificates") {
        await updateUser(user.id, { certificates: tempValue });
        // Update local user context immediately
        setUser({ ...user, certificates: tempValue });
      } else if (type === "profileImage") {
        await updateUser(user.id, { profileImage: tempValue });
        // Update local user context to ensure consistency
        setUser({ ...user, profileImage: tempValue });
      } else if (type === "skills") {
        await updateUser(user.id, { skills: tempValue.skills || [] });
        // Update local user context to ensure consistency
        setUser({ ...user, skills: tempValue.skills || [] });
      }
      await refetchUser();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border-2 border-[#B71C1C] max-h-[90vh] overflow-auto animate-fadeIn">
        <button
          aria-label="Close"
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#B71C1C] text-2xl focus:outline-none"
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold text-[#B71C1C] mb-6 capitalize tracking-wide text-center">
          Edit {type === "profileImage" ? "Profile Image" : type === "skills" ? "Skills" : type === "linkedin" ? "LinkedIn Profile" : type === "github" ? "GitHub Profile" : type}
        </h2>

        {type === "profileImage" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Current/Preview Image */}
              <div className="relative">
                <img
                  src={
                    imagePreview ||
                    user.profileImage ||
                    "https://i.pravatar.cc/100?img=5"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-[#B71C1C] shadow-lg object-cover"
                />
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors disabled:opacity-50"
                >
                  <FiUpload />
                  {uploadingImage ? "Uploading..." : "Upload New Image"}
                </button>
                {(imagePreview || user.profileImage) && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        )}

        {type === "about" && (
          <textarea
            className="w-full border-2 border-[#B71C1C] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg min-h-[120px]"
            rows={5}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Tell us about yourself..."
            disabled={loading}
          />
        )}
        {type === "linkedin" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Edit LinkedIn Profile</h3>
              <p className="text-sm text-gray-600">Update your LinkedIn profile URL</p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <input
                type="url"
                className="w-full border-2 border-[#B71C1C] pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                placeholder="https://linkedin.com/in/your-profile"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Make sure to include the full URL starting with https://
            </div>
          </div>
        )}
        
        {type === "github" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Edit GitHub Profile</h3>
              <p className="text-sm text-gray-600">Update your GitHub profile URL</p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <input
                type="url"
                className="w-full border-2 border-[#B71C1C] pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                placeholder="https://github.com/your-username"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Make sure to include the full URL starting with https://
            </div>
          </div>
        )}
        {type === "education" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="School / University"
              value={tempValue.school || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, school: e.target.value })
              }
              className="w-full border-2 border-[#B71C1C] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Degree / Major"
              value={tempValue.degree || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, degree: e.target.value })
              }
              className="w-full border-2 border-[#B71C1C] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Year of Graduation"
              value={tempValue.year || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, year: e.target.value })
              }
              className="w-full border-2 border-[#B71C1C] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
              disabled={loading}
            />
          </div>
        )}
        {type === "experience" && (
          <div className="space-y-4">
            {(Array.isArray(tempValue) ? tempValue : []).map((exp, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none"
                    placeholder="Job Title"
                    value={exp.jobTitle || ""}
                    onChange={(e) => {
                      const arr = [...tempValue];
                      arr[i] = { ...arr[i], jobTitle: e.target.value };
                      setTempValue(arr);
                    }}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none"
                    placeholder="Company"
                    value={exp.company || ""}
                    onChange={(e) => {
                      const arr = [...tempValue];
                      arr[i] = { ...arr[i], company: e.target.value };
                      setTempValue(arr);
                    }}
                    disabled={loading}
                  />
                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                     <input
                       type="date"
                       className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none"
                       value={exp.startDate || ""}
                       onChange={(e) => {
                         const arr = [...tempValue];
                         arr[i] = { ...arr[i], startDate: e.target.value };
                         setTempValue(arr);
                       }}
                       disabled={loading}
                     />
                   </div>
                                       <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none"
                        value={exp.endDate === "Present" ? "" : (exp.endDate || "")}
                        onChange={(e) => {
                          const arr = [...tempValue];
                          arr[i] = { ...arr[i], endDate: e.target.value };
                          setTempValue(arr);
                        }}
                        disabled={loading || exp.endDate === "Present"}
                      />
                      <div className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          id={`present-${i}`}
                          checked={exp.endDate === "Present"}
                          onChange={(e) => {
                            const arr = [...tempValue];
                            arr[i] = { ...arr[i], endDate: e.target.checked ? "Present" : "" };
                            setTempValue(arr);
                          }}
                          className="mr-2"
                          disabled={loading}
                        />
                        <label htmlFor={`present-${i}`} className="text-sm text-gray-600">Currently working here</label>
                      </div>
                    </div>
                 </div>
                <textarea
                  className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none min-h-[80px]"
                  placeholder="Key tasks, responsibilities, or achievements"
                  value={exp.tasks || ""}
                  onChange={(e) => {
                    const arr = [...tempValue];
                    arr[i] = { ...arr[i], tasks: e.target.value };
                    setTempValue(arr);
                  }}
                  disabled={loading}
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setTempValue(tempValue.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded-lg"
                    disabled={loading}
                  >
                    Delete Experience
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setTempValue([...(tempValue || []), { jobTitle: "", company: "", startDate: "", endDate: "", tasks: "" }])
              }
              className="text-[#B71C1C] underline hover:text-[#B71C1C]/80"
              disabled={loading}
            >
              Add Experience
            </button>
          </div>
        )}
        {type === "certificates" && (
          <div className="space-y-4">
            {(Array.isArray(tempValue) ? tempValue : []).map((c, i) => (
              <div key={i} className="border-2 border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="space-y-3">
                  {/* Certificate Title and Year */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={c.title || ""}
                      onChange={(e) => {
                        const arr = [...tempValue];
                        arr[i] = { ...arr[i], title: e.target.value };
                        setTempValue(arr);
                      }}
                      placeholder="Certificate Title"
                      className="flex-1 border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                      disabled={loading}
                    />
                    <input
                      type="number"
                      value={c.year || ""}
                      onChange={(e) => {
                        const arr = [...tempValue];
                        arr[i] = { ...arr[i], year: e.target.value };
                        setTempValue(arr);
                      }}
                      placeholder="Year"
                      className="w-24 border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                      disabled={loading}
                    />
                  </div>

                  {/* Certificate File Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Certificate File</label>
                    <div className="flex items-center gap-3">
                      {c.fileUrl ? (
                        <div className="flex-1 flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300">
                          {/* Show image preview if it's an image file */}
                          {c.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={c.fileUrl} 
                                alt="Certificate preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {c.fileName || "Certificate File"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {c.fileUrl.includes('cloudinary.com') ? 'Uploaded to Cloudinary' : 'File attached'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={c.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View certificate"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => handleRemoveCertificateFile(i)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove file"
                              disabled={loading}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={async (e) => {
                              try {
                                setLoading(true);
                                const file = e.target.files[0];
                                if (!file) return;

                                // Validate file size (max 10MB)
                                if (file.size > 10 * 1024 * 1024) {
                                  throw new Error("File size should be less than 10MB");
                                }

                                // Upload to Cloudinary
                                const fileUrl = await upload(e);
                                
                                // Update the certificate with file info
                                const arr = [...tempValue];
                                arr[i] = { 
                                  ...arr[i], 
                                  fileUrl: fileUrl,
                                  fileName: file.name
                                };
                                setTempValue(arr);
                                
                                // Update user context immediately for instant UI update
                                setUser({ ...user, certificates: arr });
                                
                                // Mark as changed so user knows they have unsaved changes
                                setChanged(true);
                                
                                toast.success("Certificate file uploaded successfully!");
                              } catch (err) {
                                console.error("Upload error:", err);
                                toast.error(err.message || "Failed to upload file. Please try again.");
                                // Reset file input
                                e.target.value = "";
                              } finally {
                                setLoading(false);
                              }
                            }}
                            className="hidden"
                            id={`cert-file-${i}`}
                            disabled={loading}
                          />
                          <label
                            htmlFor={`cert-file-${i}`}
                            className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#B71C1C] hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-slate-600">
                              {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#B71C1C]"></div>
                              ) : (
                                <FiUpload size={16} />
                              )}
                              <span className="text-sm font-medium">
                                {loading ? "Uploading..." : "Upload Certificate File"}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG. Max size: 10MB
                    </p>
                  </div>

                  {/* Issuer Field */}
                  <input
                    type="text"
                    value={c.issuer || ""}
                    onChange={(e) => {
                      const arr = [...tempValue];
                      arr[i] = { ...arr[i], issuer: e.target.value };
                      setTempValue(arr);
                    }}
                    placeholder="Issuing Organization (optional)"
                    className="w-full border-2 border-[#B71C1C] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                    disabled={loading}
                  />

                  {/* Delete Certificate Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setTempValue(tempValue.filter((_, idx) => idx !== i))}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <FiTrash2 size={16} />
                      Delete Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() =>
                setTempValue([...(tempValue || []), { title: "", year: "", issuer: "", fileUrl: "", fileName: "" }])
              }
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C]/5 rounded-xl transition-colors font-medium"
              disabled={loading}
            >
              <FiPlus size={20} />
              Add New Certificate
            </button>
          </div>
        )}
        {type === "skills" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Add your technical skills, programming languages, frameworks, and tools to showcase your expertise.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new skill (e.g., React, Node.js, AWS)"
                value={tempValue.newSkill || ""}
                onChange={(e) => {
                  setTempValue({ ...tempValue, newSkill: e.target.value });
                }}
                className="flex-1 border-2 border-[#B71C1C] px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempValue.newSkill?.trim()) {
                    const skillValue = tempValue.newSkill.trim();
                    const currentSkills = tempValue.skills || [];
                    if (!currentSkills.includes(skillValue)) {
                      setTempValue({
                        ...tempValue,
                        skills: [...currentSkills, skillValue],
                        newSkill: ""
                      });
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  if (tempValue.newSkill?.trim()) {
                    const skillValue = tempValue.newSkill.trim();
                    const currentSkills = tempValue.skills || [];
                    if (!currentSkills.includes(skillValue)) {
                      setTempValue({
                        ...tempValue,
                        skills: [...currentSkills, skillValue],
                        newSkill: ""
                      });
                    }
                  }
                }}
                className="px-6 py-3 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors disabled:opacity-50 font-medium"
                disabled={loading || !tempValue.newSkill?.trim()}
              >
                Add
              </button>
            </div>
            
            {/* Suggested Skills */}
            <div>
              <p className="text-sm text-gray-600 mb-3 font-medium">Quick add common skills:</p>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "JavaScript", "Python", "Java", "CSS", "HTML", "MongoDB", "SQL", "Git", "Docker", "AWS", "TypeScript", "Vue.js", "Angular", "PHP", "C++", "C#", "Ruby", "Go", "Rust", "Kubernetes", "Jenkins", "GraphQL", "REST API"].map((suggestedSkill) => (
                  <button
                    key={suggestedSkill}
                    onClick={() => {
                      const currentSkills = tempValue.skills || [];
                      if (!currentSkills.includes(suggestedSkill)) {
                        setTempValue({
                          ...tempValue,
                          skills: [...currentSkills, suggestedSkill]
                        });
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors border hover:border-gray-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    + {suggestedSkill}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current Skills */}
            {(tempValue.skills || []).length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-3 font-medium">Your skills ({(tempValue.skills || []).length}):</p>
                <div className="flex flex-wrap gap-2">
                  {(tempValue.skills || []).map((skill, i) => {
                    // Helper function to get skill display value
                    const getSkillValue = (skill) => {
                      if (typeof skill === 'string') return skill;
                      if (skill && typeof skill === 'object') return skill.value || skill.name || skill.title || 'Unknown Skill';
                      return 'Unknown Skill';
                    };
                    
                    return (
                      <div key={i} className="flex items-center gap-2 bg-gradient-to-r from-[#B71C1C] to-red-600 text-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-sm font-medium">{getSkillValue(skill)}</span>
                        <button
                          onClick={() => {
                            const newSkills = (tempValue.skills || []).filter((_, idx) => idx !== i);
                            setTempValue({
                              ...tempValue,
                              skills: newSkills
                            });
                          }}
                          className="text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/20"
                          disabled={loading}
                          title="Remove skill"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-400 text-2xl">🎯</span>
                </div>
                <p className="text-gray-500 font-medium">No skills added yet</p>
                <p className="text-gray-400 text-sm mt-1">Start by adding your first skill above</p>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-8">
          {error && (
            <div className="text-red-500 text-sm mb-2 w-full">{error}</div>
          )}
          <button
            onClick={handleCancel}
            className="px-4 py-2 border-2 border-[#B71C1C] rounded-lg text-[#B71C1C] font-semibold bg-white hover:bg-[#B71C1C]/10 transition-colors text-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#B71C1C] text-white rounded-lg font-semibold text-lg hover:bg-[#B71C1C]/90 transition-colors disabled:opacity-50"
            disabled={loading || (!changed && type !== "profileImage")}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
