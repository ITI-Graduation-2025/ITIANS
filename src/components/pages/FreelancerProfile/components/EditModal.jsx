"use client";

import { useState, useEffect } from "react";
import { updateUser } from "@/services/firebase";

export const EditModal = ({ type, onClose, user, refetchUser }) => {
  const [tempValue, setTempValue] = useState("");
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
  }, [type, user]);

  const handleSave = async () => {
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
    }
    await refetchUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 space-y-4 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold capitalize">Edit {type}</h2>
        {type === "about" && (
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
        )}
        {type === "links" && (
          <>
            <input
              type="url"
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="GitHub Profile"
              value={tempValue.github || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, github: e.target.value })
              }
            />
            <input
              type="url"
              className="w-full border px-3 py-2 rounded"
              placeholder="LinkedIn Profile"
              value={tempValue.linkedIn || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, linkedIn: e.target.value })
              }
            />
          </>
        )}
        {type === "education" && (
          <>
            <input
              type="text"
              placeholder="School / University"
              value={tempValue.school || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, school: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Degree / Major"
              value={tempValue.degree || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, degree: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="number"
              placeholder="Year of Graduation"
              value={tempValue.year || ""}
              onChange={(e) =>
                setTempValue({ ...tempValue, year: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}
        {type === "certificates" && (
          <>
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
                  className="border px-2 py-1 rounded"
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
                  className="border px-2 py-1 rounded w-24"
                />
                <button
                  onClick={() =>
                    setTempValue(tempValue.filter((_, idx) => idx !== i))
                  }
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setTempValue([...(tempValue || []), { title: "", year: "" }])
              }
              className="text-blue-600 underline"
            >
              Add Certificate
            </button>
          </>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#B71C1C] text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
