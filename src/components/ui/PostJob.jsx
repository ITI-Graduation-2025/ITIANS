"use client";  

import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function PostJob() {
  const { data: session } = useSession();
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "company",
      "location",
      "salary",
      "skills",
      "description",
      "requirements",
      "email",
      "deadline",
    ];

    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
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
      const userId = session?.user?.id;
      if (!userId) {
        toast.error("You must be logged in to post a job.");
        setLoading(false);
        return;
      }

      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Timestamp.fromDate(deadlineDate);

      // إنشاء الوظيفة
      await addDoc(collection(db, "jobs"), {
        ...formData,
        deadline: deadlineTimestamp,
        createdAt: serverTimestamp(),
        status: "Active",
        applicationsCount: 0,
        views: 0,
        postedBy: userId,
        companyId: userId,
        applicants: [],
      });

      toast.success("Job posted successfully!");

      const companyRef = doc(db, "users", userId);
      const companySnap = await getDoc(companyRef);

      if (companySnap.exists()) {
        const companyData = companySnap.data();
        const currentActiveJobs = companyData?.stats?.activeJobs || 0;
        const currentTotalJobs = companyData?.stats?.totalJobs || 0;

        await updateDoc(companyRef, {
          "stats.activeJobs": currentActiveJobs + 1,
          "stats.totalJobs": currentTotalJobs + 1,
          recentActivities: arrayUnion({
            type: "job_posted",
            text: `Posted a new job: ${formData.title}`,
            detail: new Date().toLocaleDateString(),
          }),
        });
      } else {
        await setDoc(companyRef, {
          stats: {
            activeJobs: 1,
            totalJobs: 1,
            totalHires: 0,
            successRate: "0%",
          },
          recentActivities: [
            {
              type: "job_posted",
              text: `Posted a new job: ${formData.title}`,
              detail: new Date().toLocaleDateString(),
            },
          ],
        });
      }

      setFormData({
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
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error("Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f2]">
      <Toaster position="top-right" />
      <main className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>
          <Link
            href="/companyjobs"
            className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Jobs
          </Link>
        </div>
        <p className="text-gray-600 mb-6">
          Connect with skilled ITI graduates for your projects
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Job Title" name="title" value={formData.title} onChange={handleChange} />
            <InputField label="Company Name" name="company" value={formData.company} onChange={handleChange} />
            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
            <SelectField label="Job Type" name="type" value={formData.type} onChange={handleChange} options={["Full Time", "Part Time", "Contract"]} />
            <SelectField label="Experience Level" name="level" value={formData.level} onChange={handleChange} options={["Entry Level (0-2 years)", "Mid Level (2-5 years)", "Senior Level (5+ years)"]} />
            <InputField label="Salary Range" name="salary" value={formData.salary} onChange={handleChange} />
          </div>

          <InputField label="Required Skills" name="skills" value={formData.skills} onChange={handleChange} />
          <TextAreaField label="Job Description" name="description" value={formData.description} onChange={handleChange} max={500} />
          <TextAreaField label="Requirements" name="requirements" value={formData.requirements} onChange={handleChange} max={500} />

          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Contact Email" name="email" value={formData.email} onChange={handleChange} type="email" />
            <InputField label="Application Deadline" name="deadline" value={formData.deadline} onChange={handleChange} type="date" />
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 mx-auto"
            >
              <Send className="w-4 h-4" />
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// 🔧 دالة لتحديث حالة المتقدم (قبول/رفض) داخل الوظيفة
export async function updateApplicantStatus(jobId, applicantId, status) {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      toast.error("Job not found");
      return;
    }

    const jobData = jobSnap.data();
    const updatedApplicants = jobData.applicants.map((app) =>
      app.applicantId === applicantId ? { ...app, status } : app
    );

    await updateDoc(jobRef, { applicants: updatedApplicants });
    toast.success(`Applicant ${status} successfully`);
  } catch (error) {
    console.error("Failed to update applicant status:", error);
    toast.error("Update failed");
  }
}

// ✅ مثال استخدام الدالة:
// updateApplicantStatus("job123", "applicant456", "accepted");

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label} *</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
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
        placeholder={`Write up to ${max} characters...`}
        className="w-full border rounded px-3 py-2 mt-1"
      />
      <p className="text-xs text-gray-400 text-right mt-1">
        {value.length}/{max} characters
      </p>
    </div>
  );
}




