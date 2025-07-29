"use client";

import React, { useEffect, useState } from "react";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfileEdit() {
  const { data: session } = useSession();
  const companyId = session?.user?.id; // ✅ استخدم companyId

  const [loading, setLoading] = useState(true);
  const [newSpec, setNewSpec] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    website: "",
    founded: "",
    email: "",
    phone: "",
    description: "",
    rating: 0,
    reviews: 0,
    stats: {
      activeJobs: 0,
      totalHires: 0,
      successRate: "",
    },
    specializations: [],
  });

  useEffect(() => {
    if (!companyId) return;
    const docRef = doc(db, "users", companyId); // ✅ استخدم companyId هنا

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setFormData(snap.data());
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", companyId); // ✅ استخدم companyId هنا
      await updateDoc(docRef, formData);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  const handleAddSpec = () => {
    if (!newSpec.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specializations: [...(prev.specializations || []), newSpec.trim()],
    }));
    setNewSpec("");
  };

  const handleRemoveSpec = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== indexToRemove),
    }));
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <Toaster position="top-right" />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Edit Company Profile</h1>
          <Link
            href="/companyprofile"
            className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>

        <p className="text-gray-600 mb-6">
          Update your company details and stay up-to-date
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md grid md:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="bg-red-100 text-red-600 p-5 rounded-xl mb-3">
              <Building2 className="w-10 h-10" />
            </div>
            <h2 className="font-bold text-lg">{formData.name}</h2>
            <p className="text-sm text-gray-600">{formData.industry}</p>
            <p className="text-yellow-600 text-sm mt-1">
              ⭐ {formData.rating}/5{" "}
              <span className="text-gray-500">({formData.reviews} reviews)</span>
            </p>

            <div className="bg-red-50 p-4 rounded-lg mt-6 text-center">
              <h3 className="font-semibold mb-2">Company Stats</h3>
              <p className="text-sm text-gray-600">
                Active Jobs:{" "}
                <span className="text-red-600 font-semibold">
                  {formData.stats.activeJobs}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Total Hires:{" "}
                <span className="text-red-600 font-semibold">
                  {formData.stats.totalHires}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Success Rate:{" "}
                <span className="text-red-600 font-semibold">
                  {formData.stats.successRate}
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["name", "Company Name"],
                ["industry", "Industry"],
                ["location", "Location"],
                ["size", "Company Size"],
                ["website", "Website"],
                ["founded", "Founded"],
                ["email", "Contact Email"],
                ["phone", "Phone Number"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-gray-500 text-sm">{label}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-gray-500 text-sm">Company Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-gray-500 text-sm mb-2 block">
                Specializations
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a specialization"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  className="border px-3 py-1 rounded text-sm w-full"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.specializations?.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full flex items-center gap-2"
                  >
                    {spec}
                    <button
                      onClick={() => handleRemoveSpec(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ❌
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
              >
                Save Changes
              </button>
              <Link href="/companyprofile">
                <button className="border px-5 py-2 rounded hover:bg-gray-100">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





