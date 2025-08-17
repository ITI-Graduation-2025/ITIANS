"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { approveJobCompletion, keepJobInProgress } from "@/services/jobServices";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";

export default function CompanyFinishedJobs({ companyId }) {
  const [finishedJobs, setFinishedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingJob, setProcessingJob] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, jobId: null, jobTitle: "", companyName: "" });

  useEffect(() => {
    if (!companyId) return;

    // Listen to jobs with status "finished" for this company
    const jobsQuery = query(
      collection(db, "jobs"),
      where("companyId", "==", companyId),
      where("status", "==", "finished")
    );

    const unsubscribe = onSnapshot(jobsQuery, async (snapshot) => {
      const jobs = [];
      
      for (const doc of snapshot.docs) {
        const jobData = doc.data();
        
        // Get freelancer data for each job
        if (jobData.approvedFreelancerId) {
          try {
            const freelancerRef = doc(db, "users", jobData.approvedFreelancerId);
            const freelancerSnap = await getDoc(freelancerRef);
            
            if (freelancerSnap.exists()) {
              const freelancerData = freelancerSnap.data();
              jobs.push({
                id: doc.id,
                ...jobData,
                freelancer: {
                  id: freelancerData.id || freelancerData.uid,
                  name: freelancerData.fullName || freelancerData.name || "Unknown",
                  email: freelancerData.email,
                  image: freelancerData.image || freelancerData.profileImage,
                }
              });
            }
          } catch (error) {
            console.error("Error fetching freelancer data:", error);
            // Add job without freelancer data
            jobs.push({
              id: doc.id,
              ...jobData,
              freelancer: {
                id: jobData.approvedFreelancerId,
                name: "Unknown",
                email: "Unknown",
                image: null,
              }
            });
          }
        }
      }
      
      setFinishedJobs(jobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const handleApproveCompletion = async (jobId, freelancerId, jobTitle) => {
    setProcessingJob(jobId);
    try {
      await approveJobCompletion(jobId, freelancerId, "Your Company", jobTitle);
      toast.success("Job completion approved! Job moved to completed status.");
    } catch (error) {
      console.error("Error approving job completion:", error);
      toast.error("Failed to approve job completion. Please try again.");
    } finally {
      setProcessingJob(null);
    }
  };

  const handleKeepInProgress = async (jobId, freelancerId, jobTitle, feedback = "") => {
    setProcessingJob(jobId);
    try {
      await keepJobInProgress(jobId, freelancerId, "Your Company", jobTitle, feedback);
      toast.success("Job kept in progress. Freelancer will continue working.");
      setFeedbackModal({ open: false, jobId: null, jobTitle: "", companyName: "" });
    } catch (error) {
      console.error("Error keeping job in progress:", error);
      toast.error("Failed to keep job in progress. Please try again.");
    } finally {
      setProcessingJob(null);
    }
  };

  const openFeedbackModal = (jobId, jobTitle, companyName) => {
    setFeedbackModal({ open: true, jobId, jobTitle, companyName });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (finishedJobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Finished Jobs</h3>
          <p className="text-gray-500">No freelancers have marked jobs as finished yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Jobs Marked as Finished
            <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {finishedJobs.length}
            </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve or reject job completions from freelancers.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {finishedJobs.map((job) => (
            <div key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Finished by Freelancer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Freelancer</p>
                      <div className="flex items-center gap-2 mt-1">
                        {job.freelancer.image ? (
                          <img
                            src={job.freelancer.image}
                            alt={job.freelancer.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm text-gray-600">
                              {job.freelancer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{job.freelancer.name}</p>
                          <p className="text-xs text-gray-500">{job.freelancer.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Finished Date</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {job.finishedByFreelancerAt ? 
                          new Date(job.finishedByFreelancerAt.toDate()).toLocaleDateString() : 
                          "Unknown"
                        }
                      </p>
                    </div>
                  </div>

                  {job.description && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">Job Description</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {job.description}
                      </p>
                    </div>
                  )}

                  {job.salary && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Salary</p>
                      <p className="text-sm text-gray-900">{job.salary}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApproveCompletion(job.id, job.freelancer.id, job.title)}
                  disabled={processingJob === job.id}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {processingJob === job.id ? "Processing..." : "Approve Completion"}
                </button>

                <button
                  onClick={() => openFeedbackModal(job.id, job.title, job.freelancer.name)}
                  disabled={processingJob === job.id}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  {processingJob === job.id ? "Processing..." : "Keep in Progress"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Keep Job in Progress
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide feedback to the freelancer about why the job completion was not approved.
            </p>
            
            <textarea
              id="feedback"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter feedback (optional)..."
              defaultValue=""
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setFeedbackModal({ open: false, jobId: null, jobTitle: "", companyName: "" })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const feedback = document.getElementById('feedback').value;
                  const job = finishedJobs.find(j => j.id === feedbackModal.jobId);
                  if (job) {
                    handleKeepInProgress(job.id, job.freelancer.id, job.title, feedback);
                  }
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Keep in Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
