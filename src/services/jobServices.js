import { db } from "@/config/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { sendPushNotification } from "./notificationService";

/**
 * Approve a job application and send notification to freelancer
 * @param {string} jobId - The job ID
 * @param {string} userId - The freelancer's user ID
 * @param {string} companyName - The company name for the notification
 * @param {string} jobTitle - The job title for the notification
 * @returns {Promise<Object>} - Result of the operation
 */
export const approveJobApplication = async (
  jobId,
  userId,
  companyName,
  jobTitle,
) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update applicant status to approved
    const updatedApplicants = jobData.applicants.map((applicant) => {
      if (typeof applicant === "string") {
        return applicant === userId
          ? { userId, status: "approved", approvedAt: new Date().toISOString() }
          : { userId: applicant, status: "pending" };
      }
      if (applicant.userId === userId) {
        return {
          ...applicant,
          status: "approved",
          approvedAt: new Date().toISOString(),
        };
      }
      return applicant;
    });

    // Update job status to inProgress and set the approved freelancer
    await updateDoc(jobRef, {
      applicants: updatedApplicants,
      status: "inProgress",
      approvedFreelancerId: userId,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Get freelancer data for notification
    const freelancerRef = doc(db, "users", userId);
    const freelancerSnap = await getDoc(freelancerRef);

    if (freelancerSnap.exists()) {
      const freelancerData = freelancerSnap.data();

      // Create in-app notification
      const notification = {
        recipientId: userId,
        senderId: jobData.companyId || jobData.postedBy,
        type: "job_approved",
        message: `Congratulations! Your application for "${jobTitle}" at ${companyName} has been approved. The job is now in progress.`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (freelancerData.fcmToken) {
        await sendPushNotification({
          token: freelancerData.fcmToken,
          title: "Job Application Approved! 🎉",
          body: `Your application for "${jobTitle}" at ${companyName} has been approved.`,
          data: { url: `/u/${freelancerData.username || userId}` },
        });
      }

      // Add job to freelancer's inProgressJobs
      const inProgressJob = {
        jobId: jobId,
        title: jobTitle,
        company: companyName,
        companyId: jobData.companyId || jobData.postedBy,
        status: "inProgress",
        startedAt: new Date().toISOString(),
        expectedEnd: jobData.deadline
          ? jobData.deadline.toDate().toISOString()
          : null,
        salary: jobData.salary,
        type: jobData.type,
        level: jobData.level,
        description: jobData.description,
        requirements: jobData.requirements,
      };

      await updateDoc(freelancerRef, {
        inProgressJobs: arrayUnion(inProgressJob),
        updatedAt: serverTimestamp(),
      });
    }

    return { success: true, message: "Application approved successfully" };
  } catch (error) {
    console.error("Error approving job application:", error);
    throw error;
  }
};

/**
 * Reject a job application and send notification to freelancer
 * @param {string} jobId - The job ID
 * @param {string} userId - The freelancer's user ID
 * @param {string} companyName - The company name for the notification
 * @param {string} jobTitle - The job title for the notification
 * @param {string} reason - Optional reason for rejection
 * @returns {Promise<Object>} - Result of the operation
 */
export const rejectJobApplication = async (
  jobId,
  userId,
  companyName,
  jobTitle,
  reason = "",
) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update applicant status to rejected
    const updatedApplicants = jobData.applicants.map((applicant) => {
      if (typeof applicant === "string") {
        return applicant === userId
          ? {
              userId,
              status: "rejected",
              rejectedAt: new Date().toISOString(),
              reason,
            }
          : { userId: applicant, status: "pending" };
      }
      if (applicant.userId === userId) {
        return {
          ...applicant,
          status: "rejected",
          rejectedAt: new Date().toISOString(),
          reason,
        };
      }
      return applicant;
    });

    await updateDoc(jobRef, {
      applicants: updatedApplicants,
      updatedAt: serverTimestamp(),
    });

    // Get freelancer data for notification
    const freelancerRef = doc(db, "users", userId);
    const freelancerSnap = await getDoc(freelancerRef);

    if (freelancerSnap.exists()) {
      const freelancerData = freelancerSnap.data();

      // Create in-app notification
      const notification = {
        recipientId: userId,
        senderId: jobData.companyId || jobData.postedBy,
        type: "job_rejected",
        message: `Your application for "${jobTitle}" at ${companyName} was not selected. ${reason ? `Reason: ${reason}` : ""}`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (freelancerData.fcmToken) {
        await sendPushNotification({
          token: freelancerData.fcmToken,
          title: "Job Application Update",
          body: `Your application for "${jobTitle}" at ${companyName} was not selected.`,
          data: { url: `/u/${freelancerData.username || userId}` },
        });
      }
    }

    return { success: true, message: "Application rejected successfully" };
  } catch (error) {
    console.error("Error rejecting job application:", error);
    throw error;
  }
};

/**
 * Mark a job as under review
 * @param {string} jobId - The job ID
 * @returns {Promise<Object>} - Result of the operation
 */
export const markJobUnderReview = async (jobId) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    await updateDoc(jobRef, {
      status: "underReview",
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Job marked as under review successfully",
    };
  } catch (error) {
    console.error("Error marking job as under review:", error);
    throw error;
  }
};
/**
 * Complete a job and move it to finished jobs
 * @param {string} jobId - The job ID
 * @param {string} freelancerId - The freelancer's user ID
 * @param {string} companyName - The company name
 * @param {string} jobTitle - The job title
 * @returns {Promise<Object>} - Result of the operation
 */
export const completeJob = async (
  jobId,
  freelancerId,
  companyName,
  jobTitle,
) => {
  console.log(jobId, freelancerId, companyName, jobTitle);

  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update job status to completed
    await updateDoc(jobRef, {
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Get freelancer data
    const freelancerRef = doc(db, "users", freelancerId);
    const freelancerSnap = await getDoc(freelancerRef);

    if (freelancerSnap.exists()) {
      const freelancerData = freelancerSnap.data();

      // Remove from inProgressJobs
      const updatedInProgressJobs = (
        freelancerData.inProgressJobs || []
      ).filter((job) => job.jobId !== jobId);

      // Add to finishedJobs
      const finishedJob = {
        jobId: jobId,
        title: jobTitle,
        company: companyName,
        companyId: jobData.companyId || jobData.postedBy,
        status: "completed",
        startedAt: jobData.approvedAt
          ? jobData.approvedAt.toDate().toISOString()
          : new Date().toISOString(),
        completedAt: new Date().toISOString(),
        salary: jobData.salary,
        type: jobData.type,
        level: jobData.level,
        description: jobData.description,
        requirements: jobData.requirements,
      };

      await updateDoc(freelancerRef, {
        inProgressJobs: updatedInProgressJobs,
        finishedJobs: arrayUnion(finishedJob),
        updatedAt: serverTimestamp(),
      });

      // Send completion notification
      const notification = {
        recipientId: freelancerId,
        senderId: jobData.companyId || jobData.postedBy,
        type: "job_completed",
        message: `Congratulations! You have successfully completed "${jobTitle}" for ${companyName}.`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (freelancerData.fcmToken) {
        await sendPushNotification({
          token: freelancerData.fcmToken,
          title: "Job Completed! 🎉",
          body: `Congratulations! You have successfully completed "${jobTitle}" for ${companyName}.`,
          data: { url: `/u/${freelancerData.username || freelancerId}` },
        });
      }
    }

    return { success: true, message: "Job completed successfully" };
  } catch (error) {
    console.error("Error completing job:", error);
    throw error;
  }
};

/**
 * Get all jobs for a freelancer with their status
 * @param {string} freelancerId - The freelancer's user ID
 * @returns {Promise<Array>} - Array of jobs with status
 */
export const getFreelancerJobs = async (freelancerId) => {
  try {
    const jobsQuery = collection(db, "jobs");
    const jobsSnapshot = await getDocs(jobsQuery);

    const jobs = [];
    jobsSnapshot.forEach((doc) => {
      const jobData = doc.data();
      const applicant = jobData.applicants?.find((app) =>
        typeof app === "string"
          ? app === freelancerId
          : app.userId === freelancerId,
      );

      if (applicant) {
        jobs.push({
          id: doc.id,
          ...jobData,
          applicationStatus:
            typeof applicant === "string" ? "pending" : applicant.status,
          appliedAt: typeof applicant === "string" ? null : applicant.appliedAt,
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error getting freelancer jobs:", error);
    throw error;
  }
};

/**
 * Mark a job as finished by freelancer and notify company
 * @param {string} jobId - The job ID
 * @param {string} freelancerId - The freelancer's user ID
 * @param {string} companyId - The company's user ID
 * @param {string} jobTitle - The job title
 * @returns {Promise<Object>} - Result of the operation
 */
export const markJobAsUnderReview = async (
  jobId,
  freelancerId,
  companyId,
  jobTitle,
) => {
  try {
    console.log(jobId, freelancerId, companyId, jobTitle);
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update job status to finished
    await updateDoc(jobRef, {
      status: "underReview",
      finishedByFreelancerAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Get company data for notification
    const companyRef = doc(db, "users", companyId);
    const companySnap = await getDoc(companyRef);

    if (companySnap.exists()) {
      const companyData = companySnap.data();

      // Create in-app notification for company
      const notification = {
        recipientId: companyId,
        senderId: freelancerId,
        type: "job_underReview",
        message: `A freelancer has marked the job "${jobTitle}" as under review. Please review and approve or keep in progress.`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      console.log(notification);
      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (companyData.fcmToken) {
        await sendPushNotification({
          token: companyData.fcmToken,
          title: "Job under review! 📋",
          body: `A freelancer has marked "${jobTitle}" as under review. Please review.`,
          data: { url: `/dashboardCompany/finished` },
        });
      }
    }

    return {
      success: true,
      message: "Job marked as under review successfully",
    };
  } catch (error) {
    console.error("Error marking job as under review:", error);
    throw error;
  }
};

/**
 * Approve job completion and move to completed status
 * @param {string} jobId - The job ID
 * @param {string} freelancerId - The freelancer's user ID
 * @param {string} companyName - The company name
 * @param {string} jobTitle - The job title
 * @returns {Promise<Object>} - Result of the operation
 */
export const approveJobCompletion = async (
  jobId,
  freelancerId,
  companyName,
  jobTitle,
) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update job status to completed
    await updateDoc(jobRef, {
      status: "completed",
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Get freelancer data
    const freelancerRef = doc(db, "users", freelancerId);
    const freelancerSnap = await getDoc(freelancerRef);

    if (freelancerSnap.exists()) {
      const freelancerData = freelancerSnap.data();

      // Remove from inProgressJobs
      const updatedInProgressJobs = (
        freelancerData.inProgressJobs || []
      ).filter((job) => job.jobId !== jobId);

      // Add to finishedJobs
      const finishedJob = {
        jobId: jobId,
        title: jobTitle,
        company: companyName,
        companyId: jobData.companyId || jobData.postedBy,
        status: "completed",
        startedAt: jobData.approvedAt
          ? jobData.approvedAt.toDate().toISOString()
          : new Date().toISOString(),
        completedAt: new Date().toISOString(),
        salary: jobData.salary,
        type: jobData.type,
        level: jobData.level,
        description: jobData.description,
        requirements: jobData.requirements,
      };

      await updateDoc(freelancerRef, {
        inProgressJobs: updatedInProgressJobs,
        finishedJobs: arrayUnion(finishedJob),
        updatedAt: serverTimestamp(),
      });

      // Send completion notification to freelancer
      const notification = {
        recipientId: freelancerId,
        senderId: jobData.companyId || jobData.postedBy,
        type: "job_completion_approved",
        message: `Congratulations! Your completion of "${jobTitle}" for ${companyName} has been approved.`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (freelancerData.fcmToken) {
        await sendPushNotification({
          token: freelancerData.fcmToken,
          title: "Job Completion Approved! 🎉",
          body: `Your completion of "${jobTitle}" for ${companyName} has been approved.`,
          data: { url: `/u/${freelancerData.username || freelancerId}` },
        });
      }
    }

    return { success: true, message: "Job completion approved successfully" };
  } catch (error) {
    console.error("Error approving job completion:", error);
    throw error;
  }
};

/**
 * Keep job in progress and notify freelancer
 * @param {string} jobId - The job ID
 * @param {string} freelancerId - The freelancer's user ID
 * @param {string} companyName - The company name
 * @param {string} jobTitle - The job title
 * @param {string} feedback - Optional feedback from company
 * @returns {Promise<Object>} - Result of the operation
 */
export const keepJobInProgress = async (
  jobId,
  freelancerId,
  companyName,
  jobTitle,
  feedback = "",
) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      throw new Error("Job not found");
    }

    const jobData = jobSnap.data();

    // Update job status back to inProgress
    await updateDoc(jobRef, {
      status: "inProgress",
      updatedAt: serverTimestamp(),
      companyFeedback: feedback,
    });

    // Get freelancer data
    const freelancerRef = doc(db, "users", freelancerId);
    const freelancerSnap = await getDoc(freelancerRef);

    if (freelancerSnap.exists()) {
      const freelancerData = freelancerSnap.data();

      // Send feedback notification to freelancer
      const notification = {
        recipientId: freelancerId,
        senderId: jobData.companyId || jobData.postedBy,
        type: "job_keep_in_progress",
        message: `Your completion of "${jobTitle}" for ${companyName} was not approved. ${feedback ? `Feedback: ${feedback}` : "Please continue working on the job."}`,
        relatedId: jobId,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "notifications"), notification);

      // Send push notification if FCM token exists
      if (freelancerData.fcmToken) {
        await sendPushNotification({
          token: freelancerData.fcmToken,
          title: "Job Update",
          body: `Your completion of "${jobTitle}" for ${companyName} was not approved. Please continue working.`,
          data: { url: `/u/${freelancerData.username || freelancerId}` },
        });
      }
    }

    return { success: true, message: "Job kept in progress successfully" };
  } catch (error) {
    console.error("Error keeping job in progress:", error);
    throw error;
  }
};
