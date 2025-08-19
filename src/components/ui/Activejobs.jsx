"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import CompanyNavbar from "./CompanyNavbar";

// Import icons
import { FiClipboard, FiClock, FiCheckCircle } from "react-icons/fi";

export default function ActiveJobs() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!companyId) return;

    const fetchJobs = async () => {
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef, where("companyId", "==", companyId));
      const querySnapshot = await getDocs(q);

      const jobList = [];

      for (const docSnap of querySnapshot.docs) {
        const job = docSnap.data();
        const approvedFreelancers = job.applicants?.filter(
          (app) => app.status === "approved" || app.status === "completed",
        );

        if (approvedFreelancers && approvedFreelancers.length > 0) {
          const freelancersData = [];

          for (const approved of approvedFreelancers) {
            let freelancerData = {
              name: approved.name || "Unknown",
              avatar:
                approved.profileImage ||
                approved.avatar ||
                "https://via.placeholder.com/50",
              role: approved.role || "Freelancer",
              userId: approved.userId,
              completed: approved.status === "completed",
              paidToAdmin: approved.paidToAdmin || false,
              status: approved.status || "approved",
            };

            if (approved.userId) {
              const userRef = doc(db, "users", approved.userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userInfo = userSnap.data();
                freelancerData = {
                  ...freelancerData,
                  name: userInfo.name || freelancerData.name,
                  avatar:
                    userInfo.photoURL ||
                    userInfo.avatar ||
                    userInfo.profileImage ||
                    userInfo.image ||
                    freelancerData.avatar,
                  role: userInfo.role || freelancerData.role,
                };
              }
            }

            const progress = freelancerData.completed ? 100 : 0;
            freelancersData.push({
              ...freelancerData,
              progress,
              salary: job.salary,
            });
          }

          jobList.push({
            id: docSnap.id,
            title: job.title,
            freelancers: freelancersData,
          });
        }
      }

      setJobs(jobList);
    };

    fetchJobs();
  }, [companyId]);

  const handlePayment = async (jobId, applicantId, salary) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        const jobData = jobSnap.data();
        const updatedApplicants = jobData.applicants.map((app) => {
          if (app.userId === applicantId) {
            return { ...app, paidToAdmin: true };
          }
          return app;
        });

        await updateDoc(jobRef, {
          applicants: updatedApplicants,
        });

        // Refresh jobs
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  freelancers: job.freelancers.map((f) =>
                    f.userId === applicantId ? { ...f, paidToAdmin: true } : f,
                  ),
                }
              : job,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    return job.freelancers.some((f) => f.status === filter);
  });

  const searchFilteredJobs = filteredJobs.filter((job) => {
    if (!searchTerm) return true;
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.freelancers.some((f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    );
  });

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view active jobs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter by Status
          </h2>

          <div className="space-y-2">
            {[
              { key: "all", label: "All Jobs", icon: FiClipboard },
              { key: "approved", label: "Approved", icon: FiClock },
              { key: "completed", label: "Completed", icon: FiCheckCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg text-left transition-colors duration-200 ${
                  filter === key
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {key === "all"
                    ? "All Jobs"
                    : key === "approved"
                      ? "In Progress"
                      : "Completed"}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Freelancer Overview
            </h1>

            <input
              type="text"
              placeholder="Search by job title or freelancer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 p-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {searchFilteredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs match this filter</p>
          ) : (
            searchFilteredJobs.map((job) =>
              job.freelancers.map((freelancer) => (
                <div
                  key={`${job.id}-${freelancer.userId}`}
                  className="bg-white p-5 rounded-xl shadow-md mb-4 flex justify-between items-center transition hover:shadow-lg"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {job.title}
                    </h3>

                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        Salary:{" "}
                        <span className="font-medium">
                          ${freelancer.salary}
                        </span>
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                        <div
                          className={`h-3 ${
                            freelancer.completed
                              ? freelancer.paidToAdmin
                                ? "bg-green-500"
                                : "bg-yellow-400"
                              : "bg-blue-400"
                          } transition-all duration-500`}
                          style={{ width: `${freelancer.progress}%` }}
                        ></div>
                      </div>

                      <p className="text-xs mt-1 text-gray-600">
                        {freelancer.completed
                          ? freelancer.paidToAdmin
                            ? "Completed & Paid"
                            : "Completed & Not Paid"
                          : "In Progress"}
                      </p>

                      <button
                        onClick={() =>
                          handlePayment(
                            job.id,
                            freelancer.userId,
                            freelancer.salary,
                          )
                        }
                        className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        Pay to Admin
                      </button>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-center">
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {freelancer.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {freelancer.role}
                    </span>
                  </div>
                </div>
              )),
            )
          )}
        </main>
      </div>
    </div>
  );
}
