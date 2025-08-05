"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  FaMapPin,
  FaBriefcase,
  FaDollarSign,
  FaUser,
  FaPen,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Toaster, toast } from "sonner";

// Default styles for Toaster
const defaultToastStyles = {
  error: { background: "#901b20", color: "white" },
  success: { background: "#B33C42", color: "white" },
  warning: { background: "#901b20", color: "white" },
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [comment, setComment] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteCommentIndex, setDeleteCommentIndex] = useState(null);
  const textareaRef = useRef(null);
  const currentUser = useCurrentUser();
  const [userRole, setUserRole] = useState(null);

  // Colors for initial circle
  const initialColors = [
    "bg-[#901b20]",
    "bg-[#B33C42]",
    "bg-[#D97706]",
    "bg-gray-600",
    "bg-blue-600",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const display = data.name || data.email || "Unknown User";
            return {
              id: doc.id,
              display,
              role: data.role,
              profileImage: data.profileImage || null,
            };
          })
          .filter((user) => user.display);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users. Please try again.", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.error,
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jobData = { id: docSnap.id, ...docSnap.data() };
          if (jobData.createdAt && jobData.createdAt.toDate) {
            jobData.createdAt = jobData.createdAt.toDate();
          }
          if (jobData.deadline && jobData.deadline.toDate) {
            jobData.deadline = jobData.deadline.toDate();
          }
          if (jobData.comments) {
            jobData.comments = jobData.comments.map((comment) => ({
              ...comment,
              timestamp: comment.timestamp.toDate
                ? comment.timestamp.toDate()
                : comment.timestamp,
            }));
          }
          if (
            currentUser?.uid &&
            jobData.applicants?.some(
              (applicant) => applicant.userId === currentUser.uid,
            )
          ) {
            setIsApplied(true);
          }
          setJob(jobData);
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserRole = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUsers();
    if (id) fetchJob();
    fetchUserRole();
  }, [id, currentUser?.uid]);

  if (isLoading) {
    return null;
  }

  if (!job) {
    return <p className="text-center text-[#901b20] p-10">Job not found.</p>;
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj =
      date instanceof Date
        ? date
        : date.toDate
          ? date.toDate()
          : new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj)
      ? dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  const isDeadlinePassed = () => {
    if (!job.deadline) return false;
    const deadlineDate =
      job.deadline instanceof Date
        ? job.deadline
        : job.deadline.toDate
          ? job.deadline.toDate()
          : new Date(job.deadline);
    return deadlineDate < new Date();
  };

  const handleApply = async () => {
    if (!currentUser?.uid) {
      toast.error("Please log in to apply for this job.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
      return;
    }

    if (isDeadlinePassed()) {
      toast.error("The application deadline has passed.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
      return;
    }

    try {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) {
        toast.error("Job not found.", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.error,
        });
        return;
      }

      const jobData = jobSnap.data();
      const userId = currentUser.uid;

      if (
        jobData.applicants?.some((applicant) => applicant.userId === userId)
      ) {
        toast.warning("You have already applied for this job.", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.warning,
        });
        return;
      }

      const applicantData = { userId, status: "pending" };
      await updateDoc(jobRef, {
        applicants: jobData.applicants
          ? arrayUnion(applicantData)
          : [applicantData],
        applicationsCount: (jobData.applicationsCount || 0) + 1,
      });

      setJob((prev) => ({
        ...prev,
        applicants: prev.applicants
          ? [...prev.applicants, applicantData]
          : [applicantData],
        applicationsCount: (prev.applicationsCount || 0) + 1,
      }));
      setIsApplied(true);
      toast.success("Applied successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.success,
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply. Please try again.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
    }
  };

  const handleReject = async (userId) => {
    try {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);
      if (!jobSnap.exists()) {
        toast.error("Job not found.", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.error,
        });
        return;
      }

      const jobData = jobSnap.data();
      const applicant = jobData.applicants?.find(
        (app) => app.userId === userId,
      );
      if (!applicant) {
        toast.error("Applicant not found.", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.error,
        });
        return;
      }

      const updatedApplicant = { ...applicant, status: "rejected" };
      await updateDoc(jobRef, {
        applicants: [
          ...jobData.applicants.filter((app) => app.userId !== userId),
          updatedApplicant,
        ],
      });

      setJob((prev) => ({
        ...prev,
        applicants: [
          ...prev.applicants.filter((app) => app.userId !== userId),
          updatedApplicant,
        ],
      }));
      toast.success("Applicant rejected successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.success,
      });
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      toast.error("Failed to reject applicant. Please try again.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
      return;
    }

    try {
      const jobRef = doc(db, "jobs", id);
      const commentData = {
        userId: currentUser?.uid,
        userName:
          users.find((user) => user.id === currentUser?.uid)?.display ||
          "Unknown User",
        text: comment.trim(),
        timestamp: new Date(),
      };

      if (editingComment !== null) {
        const oldComment = job.comments[editingComment];
        await updateDoc(jobRef, {
          comments: arrayRemove(oldComment),
        });
        await updateDoc(jobRef, {
          comments: arrayUnion(commentData),
        });

        setJob((prev) => ({
          ...prev,
          comments: prev.comments.map((c, index) =>
            index === editingComment ? commentData : c,
          ),
        }));
        toast.success("Comment updated successfully!", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.success,
        });
      } else {
        await updateDoc(jobRef, {
          comments: arrayUnion(commentData),
        });

        setJob((prev) => ({
          ...prev,
          comments: [commentData, ...(prev.comments || [])],
        }));
        toast.success("Comment added successfully!", {
          position: "bottom-center",
          duration: 3000,
          style: defaultToastStyles.success,
        });
      }

      setComment("");
      setSuggestions([]);
      setIsCommentPopupOpen(false);
      setEditingComment(null);
    } catch (error) {
      console.error("Error saving comment:", error);
      toast.error("Failed to save comment. Please try again.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
    }
  };

  const handleEditComment = (index) => {
    const commentToEdit = job.comments[index];
    setComment(commentToEdit.text);
    setEditingComment(index);
    setIsCommentPopupOpen(true);
  };

  const handleDeleteComment = async (index) => {
    try {
      const jobRef = doc(db, "jobs", id);
      const commentToDelete = job.comments[index];
      await updateDoc(jobRef, {
        comments: arrayRemove(commentToDelete),
      });

      setJob((prev) => ({
        ...prev,
        comments: prev.comments.filter((_, i) => i !== index),
      }));
      toast.success("Comment deleted successfully!", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.success,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.", {
        position: "bottom-center",
        duration: 3000,
        style: defaultToastStyles.error,
      });
    }
    setIsDeletePopupOpen(false);
    setDeleteCommentIndex(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setComment(value);
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);

    const textBeforeCursor = value.slice(0, cursor);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1).trimStart();
      if (query || query === "") {
        const filteredSuggestions = users.filter(
          (user) =>
            user.display.toLowerCase().includes(query.toLowerCase()) &&
            user.role !== "company",
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (selectedUser) => {
    const textBeforeCursor = comment.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const alias = selectedUser.display.split(" ")[0];
      const newComment =
        comment.slice(0, lastAtIndex) +
        `@${alias} ` +
        comment.slice(cursorPosition);
      setComment(newComment);
      setSuggestions([]);
      textareaRef.current.focus();
      setCursorPosition(lastAtIndex + alias.length + 2);
    }
  };

  const getInitialColor = (userName) => {
    const index = userName.charCodeAt(0) % initialColors.length;
    return initialColors[index];
  };

  const renderCommentText = (text) => {
    const mentionRegex = /@[\w\s]+?(?=\s|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + mention.length;

      const mentionText = mention.slice(1).split(" ")[0];

      if (startIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="text-gray-800">
            {text.slice(lastIndex, startIndex)}
          </span>,
        );
      }

      parts.push(
        <span
          key={`mention-${startIndex}`}
          className="text-[#901b20] bg-[#FFE4E6] px-1 rounded-sm font-medium"
        >
          {mentionText}
        </span>,
      );

      lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-gray-800">
          {text.slice(lastIndex)}
        </span>,
      );
    }

    return parts;
  };

  return (
    <section className="min-h-screen bg-[var(--background)] py-12 px-6">
      <div className="w-full sm:max-w-4xl mx-auto bg-[#fcfcfc] p-10 md:p-14 rounded-2xl border border-transparent shadow-xl hover:shadow-2xl transition-shadow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-5xl md:text-5xl font-bold text-[#901b20] tracking-tight">
              {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-lg font-medium">
                Posted on {formatDate(job.createdAt)}
              </span>
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-[#FCEEEF] text-base font-semibold"
                title="Number of Applicants"
              >
                {job.applicationsCount || 0}
              </span>
            </div>
          </div>

          <div>
            <Link
              href={job.companyId ? `/company/${job.companyId}` : "/company"}
              className="flex items-center gap-2 text-2xl md:text-2xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              <FaLink className="w-5 h-5" />
              {job.company.charAt(0).toUpperCase() + job.company.slice(1)}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 text-base font-medium text-[#1F2937]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-800">
              <span className="flex items-center px-4 py-2 border border-transparent rounded-xl bg-[#FCEEEF] shadow-sm hover:shadow-md transition-shadow duration-200">
                <FaMapPin className="w-6 h-6 mr-3 text-[#901b20]" />
                {job.location || "N/A"}
              </span>
              <span className="flex items-center px-4 py-2 border border-transparent rounded-xl bg-[#FCEEEF] shadow-sm hover:shadow-md transition-shadow duration-200">
                <FaBriefcase className="w-6 h-6 mr-3 text-[#901b20]" />
                {job.type || "N/A"}
              </span>
              <span className="flex items-center px-4 py-2 border border-transparent rounded-xl bg-[#FCEEEF] shadow-sm hover:shadow-md transition-shadow duration-200">
                <FaDollarSign className="w-6 h-6 mr-3 text-[var(--primary)]" />
                {job.salary || "N/A"}
              </span>
              <span className="flex items-center px-4 py-2 border border-transparent rounded-xl bg-[#FCEEEF] shadow-sm hover:shadow-md transition-shadow duration-200">
                <FaUser className="w-6 h-6 mr-3 text-[var(--primary)]" />
                {job.level || "N/A"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-semibold text-[var(--primary)] mb-4">
              Description
            </h3>
            <p className="text-gray-900 leading-7 break-words line-clamp-6 max-h-[12rem] overflow-hidden text-lg font-medium">
              {job.description || "No description available."}
            </p>
          </div>

          {job.requirements && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-[var(--primary)] mb-4">
                Requirements
              </h3>
              <p className="text-gray-900 text-lg leading-7 break-words line-clamp-4 max-h-[8rem] overflow-hidden font-medium">
                {job.requirements}
              </p>
            </div>
          )}

          {job.skills && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-[var(--primary)] mb-4">
                Skills
              </h3>
              <p className="text-gray-900 text-lg leading-7 break-words line-clamp-4 max-h-[8rem] overflow-hidden font-medium">
                {job.skills}
              </p>
            </div>
          )}

          {job.deadline && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-[var(--primary)] mb-4">
                Deadline
              </h3>
              <p className="text-gray-900 text-lg leading-7 font-medium">
                {formatDate(job.deadline)}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {userRole === "freelancer" && (
              // <button
              //   onClick={handleApply}
              //   disabled={isApplied || isDeadlinePassed()}
              //   className={`flex-1 min-w-[150px] text-center px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out shadow-md hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-[var(--primary)] cursor-not-allowed ${
              //     isApplied || isDeadlinePassed()
              //       ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              //       : "bg-[var(--primary)] text-white hover:bg-[#6B1519] cursor-pointer"
              //   }`}
              // >
              //   {isDeadlinePassed()
              //     ? "Deadline Passed"
              //     : isApplied
              //       ? "Applied"
              //       : "Apply Now"}
              // </button>
              <button
                onClick={handleApply}
                disabled={isApplied || isDeadlinePassed()}
                className={`flex-1 min-w-[150px] text-center px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out shadow-md focus:ring-2 focus:ring-[var(--primary)] ${
                  isApplied || isDeadlinePassed()
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-[var(--primary)] text-white hover:bg-[#6B1519] hover:scale-105 hover:shadow-lg"
                }`}
              >
                {isDeadlinePassed()
                  ? "Deadline Passed"
                  : isApplied
                    ? "Applied"
                    : "Apply Now"}
              </button>
            )}
            {["freelancer", "mentor"].includes(userRole) && (
              <button
                onClick={() => setIsCommentPopupOpen(true)}
                className="flex-1 min-w-[150px] text-center px-6 py-2 rounded-lg text-lg font-semibold bg-[#901b20] text-white hover:bg-[#6B1519] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#901b20] transition-all duration-200 ease-in-out shadow-md"
              >
                Mention
              </button>
            )}
            {userRole === "company" && (
              <button
                onClick={() => handleReject(currentUser?.uid)}
                className="flex-1 min-w-[150px] text-center px-6 py-2 rounded-lg text-lg font-semibold bg-[#901b20] text-white hover:bg-[#6B1519] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#901b20] transition-all duration-200 ease-in-out shadow-md"
              >
                Reject Applicant (Test)
              </button>
            )}
          </div>

          {isCommentPopupOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
              >
                <h3 className="text-xl font-semibold text-[#901b20] mb-4">
                  {editingComment !== null ? "Edit Comment" : "Add a Comment"}
                </h3>
                {!loadingUsers ? (
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={comment}
                      onChange={handleInputChange}
                      placeholder="Type @ to mention someone..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#901b20]"
                      rows="4"
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {suggestions.map((user) => (
                          <li
                            key={user.id}
                            onClick={() => handleSuggestionSelect(user)}
                            className="p-2 hover:bg-[#FFE4E6] cursor-pointer"
                          >
                            @{user.display}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Loading users...</p>
                )}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleCommentSubmit}
                    className="flex-1 bg-[#901b20] text-white py-3 rounded-lg hover:bg-[#6B1519] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#901b20] transition-all duration-200"
                    disabled={loadingUsers}
                  >
                    {editingComment !== null ? "Update" : "Submit"}
                  </button>
                  <button
                    onClick={() => {
                      setComment("");
                      setSuggestions([]);
                      setIsCommentPopupOpen(false);
                      setEditingComment(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 hover:scale-105 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isDeletePopupOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm"
              >
                <h3 className="text-lg font-semibold text-[#901b20] mb-4">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDeleteComment(deleteCommentIndex)}
                    className="flex-1 bg-[#901b20] text-white py-3 rounded-lg hover:bg-[#6B1519] hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#901b20] transition-all duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setIsDeletePopupOpen(false);
                      setDeleteCommentIndex(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 hover:scale-105 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {job.comments && job.comments.length > 0 && (
            <div className="mt-8">
              <h3 className="text-3xl font-semibold text-[#901b20] mb-4">
                Comments
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-[#FCEEEF] text-base font-semibold ms-4"
                  title="Number of Comments"
                >
                  {job.comments.length}
                </span>
              </h3>
              <div
                className={`space-y-4 px-4 ${
                  job.comments.length > 3 ? "max-h-96 overflow-y-auto" : ""
                }`}
              >
                {job.comments.map((comment, index) => {
                  const commenter = users.find(
                    (user) => user.id === comment.userId,
                  );
                  const profileImage = commenter?.profileImage;
                  const userName = comment.userName || "Unknown User";
                  const initial = userName.charAt(0).toUpperCase();
                  const initialColor = getInitialColor(userName);

                  return (
                    <div
                      key={index}
                      className="p-4 bg-white border border-gray-200 rounded-xl flex gap-4 relative shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={userName}
                          className="w-14 h-14 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold ${initialColor} shadow-sm`}
                        >
                          {initial}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900 font-bold">{userName}</p>
                          {comment.userId === currentUser?.uid && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditComment(index)}
                                className="text-gray-600 hover:text-[#901b20] transition-colors duration-200"
                                title="Edit"
                              >
                                <FaPen />
                              </button>
                              <button
                                onClick={() => {
                                  setIsDeletePopupOpen(true);
                                  setDeleteCommentIndex(index);
                                }}
                                className="text-[#901b20] hover:text-[#6B1519] transition-colors duration-200"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-800 leading-7 font-medium">
                          {renderCommentText(comment.text)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(comment.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Toaster position="bottom-center" />
    </section>
  );
}
