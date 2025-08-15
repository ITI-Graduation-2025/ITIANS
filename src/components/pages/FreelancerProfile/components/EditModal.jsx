"use client";

import { useUserContext } from "@/context/userContext";
import { updateUser } from "@/services/userServices";
import { upload } from "@/utils/upload";
import { useEffect, useRef, useState } from "react";
import { FiTrash2, FiUpload, FiX } from "react-icons/fi";
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
    } else if (type === "links") {
      setTempValue({
        github: user.github || "",
        linkedIn: user.linkedIn || "",
      });
      setOriginalValue({
        github: user.github || "",
        linkedIn: user.linkedIn || "",
      });
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
      setTempValue(user.certificates || []);
      setOriginalValue(user.certificates || []);
    } else if (type === "profileImage") {
      setTempValue(user.profileImage || "");
      setImagePreview(user.profileImage || null);
      setOriginalValue(user.profileImage || "");
    }
    setChanged(false);
  }, [type, user]);

  useEffect(() => {
    setChanged(true);
  }, [tempValue]);



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

  const handleCancel = () => {
    // Revert to original values
    if (type === "profileImage") {
      setUser({ ...user, profileImage: originalValue });
    }
    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (type === "about") {
        await updateUser(user.id, { bio: tempValue });
      } else if (type === "links") {
        await updateUser(user.id, {
          github: tempValue.github,
          linkedIn: tempValue.linkedIn,
        });
      } else if (type === "education") {
        await updateUser(user.id, { education: tempValue });
      } else if (type === "work") {
        await updateUser(user.id, { finishedJobs: tempValue });
      } else if (type === "experience") {
        await updateUser(user.id, { workExperiences: tempValue });
        // Update local user context immediately
        setUser({ ...user, workExperiences: tempValue });
      } else if (type === "certificates") {
        await updateUser(user.id, { certificates: tempValue });
      } else if (type === "profileImage") {
        await updateUser(user.id, { profileImage: tempValue });
        // Update local user context to ensure consistency
        setUser({ ...user, profileImage: tempValue });
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
          Edit {type === "profileImage" ? "Profile Image" : type}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
        {type === "links" && (
          <div className="space-y-4">
            <input
              type="url"
              className="w-full border-2 border-[#B71C1C] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
              placeholder="GitHub Profile"
              value={tempValue.github || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, github: e.target.value })
              }
              disabled={loading}
            />
            <input
              type="url"
              className="w-full border-2 border-[#B71C1C] px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
              placeholder="LinkedIn Profile"
              value={tempValue.linkedIn || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, linkedIn: e.target.value })
              }
              disabled={loading}
            />
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
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={c.title || ""}
                  onChange={(e) => {
                    const arr = [...tempValue];
                    arr[i] = { ...arr[i], title: e.target.value };
                    setTempValue(arr);
                  }}
                  placeholder="Certificate Title"
                  className="border-2 border-[#B71C1C] px-2 py-1 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg"
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
                  className="border-2 border-[#B71C1C] px-2 py-1 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:outline-none text-lg w-24"
                  disabled={loading}
                />
                <button
                  onClick={() =>
                    setTempValue(tempValue.filter((_, idx) => idx !== i))
                  }
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded-lg"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setTempValue([...(tempValue || []), { title: "", year: "" }])
              }
              className="text-[#B71C1C] underline hover:text-[#B71C1C]/80"
              disabled={loading}
            >
              Add Certificate
            </button>
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
