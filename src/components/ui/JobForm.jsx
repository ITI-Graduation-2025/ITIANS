"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { db } from "@/config/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Pencil } from "lucide-react";

export default function JobForm({ mode = "create", job = {}, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    level: "Entry Level (0-2 years)",
    salary: "",
    skills: "",
    description: "",
    requirements: "",
    email: "",
    deadline: "",
  });

  useEffect(() => {
    if (mode === "edit" && job) {
      setFormData({
        ...job,
        deadline: job.deadline?.toDate
          ? job.deadline.toDate().toISOString().split("T")[0]
          : job.deadline || "",
      });
    }
  }, [job, mode]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "title", "company", "location", "salary", "skills",
      "description", "requirements", "email", "deadline",
    ];

    for (let field of requiredFields) {
      const value = formData[field];
      if ((typeof value === "string" && !value.trim()) || value === undefined || value === null) {
        toast.error(`Please fill out the ${field} field.`);
        return false;
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        deadline: Timestamp.fromDate(new Date(formData.deadline)),
      };

      if (mode === "create") {
        await addDoc(collection(db, "jobs"), {
          ...jobData,
          createdAt: serverTimestamp(),
          status: "Active",
          applicationsCount: 0,
          views: 0,
        });
        toast.success("Job posted successfully!");
      } else {
        await updateDoc(doc(db, "jobs", job.id), jobData);
        toast.success("Job updated successfully!");
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      toast.error(mode === "create" ? "Failed to post job." : "Failed to update job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-white/30">
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md space-y-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]"
      >
        <h1 className="text-xl md:text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Pencil className="w-5 h-5 text-red-600" />
          <span className="text-red-700 tracking-tight">Edit your Job</span>
        </h1>


        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} />
          <InputField label="Company Name" name="company" value={formData.company} onChange={handleChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
          <SelectField label="Job Type" name="type" value={formData.type} onChange={handleChange} options={["Full Time", "Part Time", "Contract"]} />
          <SelectField label="Experience Level" name="level" value={formData.level} onChange={handleChange} options={["Entry Level (0-2 years)", "Mid Level (2-5 years)", "Senior Level (5+ years)"]} />
          <InputField label="Salary Range" name="salary" value={formData.salary} onChange={handleChange} />
        </div>

        <InputField label="Required Skills" name="skills" value={formData.skills} onChange={handleChange} />
        <TextAreaField label="Job Description" name="description" value={formData.description} onChange={handleChange} />
        <TextAreaField label="Requirements" name="requirements" value={formData.requirements} onChange={handleChange} />

        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Contact Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          <InputField label="Application Deadline" name="deadline" value={formData.deadline} onChange={handleChange} type="date" />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-medium bg-white hover:bg-gray-100 hover:text-gray-800 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-200 shadow-md 
    ${loading ? "bg-red-400 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 cursor-pointer hover:shadow-lg active:scale-95 text-white"}`}
          >
            <Send className="w-4 h-4" />
            {loading
              ? mode === "create"
                ? "Posting..."
                : "Saving..."
              : mode === "create"
                ? "Post Job"
                : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label} *</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 mt-1"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label} *</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 mt-1"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, max = 500 }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label} *</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        maxLength={max}
        className="w-full border rounded px-3 py-2 mt-1"
      />
      <p className="text-xs text-gray-400 text-right mt-1">
        {value.length}/{max} characters
      </p>
    </div>
  );
}

