"use client";

import React, { useEffect, useState } from "react";
import { Building2, ArrowLeft,Pencil } from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfileEdit() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

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
    specializations: [],
  });

  useEffect(() => {
    if (!companyId) return;
    const docRef = doc(db, "users", companyId);

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
      const docRef = doc(db, "users", companyId);
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

  // ✅ Skeleton Loading UI
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <div className="col-span-2 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>
            ))}
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main UI after loading
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Toaster position="top-right" />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
         <h1 className="text-2xl font-semibold text-[#203947] tracking-tight flex items-center gap-3 mb-4">
  <Pencil className="w-6 h-6 text-[#b30000]" />
  Edit Company Profile
</h1>

          <Link
            href="/companyprofile"
            className="inline-flex items-center gap-2 bg-[#203947] text-white border  px-4 py-2 rounded-full text-sm font-medium transition duration-200 hover:bg-[#b30000] shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>

        <p className="text-gray-900 mb-6">
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
              <label className="text-gray-500 text-sm mb-2 block">Specializations</label>
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
                  className="bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white px-5 py-2 rounded-full shadow-md text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#b30000]/50"
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
                className="bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#b30000]/50 cursor-pointer"
              >
                Save Changes
              </button>
              <Link href="/companyprofile">
                <button
                  className="bg-white text-gray-700 px-6 py-2.5 rounded-full shadow-lg text-sm font-semibold tracking-wide flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300/50 cursor-pointer"
                >
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





