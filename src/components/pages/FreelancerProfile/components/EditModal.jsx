"use client";

import { useState, useEffect, useRef } from "react";
import { updateUser } from "@/services/userServices";
import { upload } from "@/utils/upload";
import { toast } from "sonner";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";

export const EditModal = ({ type, onClose, user, refetchUser }) => {
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (type === "about") setTempValue(user.bio || "");
    else if (type === "links")
      setTempValue({
        github: user.github || "",
        linkedIn: user.linkedIn || "",
      });
    else if (type === "education")
      setTempValue(user.education || { school: "", degree: "", year: "" });
    else if (type === "work") setTempValue(user.finishedJobs || []);
    else if (type === "certificates") setTempValue(user.certificates || []);
    else if (type === "profileImage") {
      setTempValue(user.profileImage || "");
      setImagePreview(user.profileImage || null);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      } else if (type === "certificates") {
        await updateUser(user.id, { certificates: tempValue });
      } else if (type === "profileImage") {
        await updateUser(user.id, { profileImage: tempValue });
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
          onClick={onClose}
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
                  src={imagePreview || user.profileImage || "https://i.pravatar.cc/100?img=5"}
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
            onClick={onClose}
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
