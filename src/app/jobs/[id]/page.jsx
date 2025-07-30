"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaCalendarAlt,
  FaPen,
  FaTrash,
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

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
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
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
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
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchJob = async () => {
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
            jobData.applicants?.includes(currentUser.uid)
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

  if (!job) {
    return <p className="text-center text-red-700 p-10">Job not found.</p>;
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

  const handleApply = async () => {
    if (!currentUser?.uid) {
      toast.error("Please log in to apply for this job.", {
        position: "bottom-center",
        duration: 3000,
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
        });
        return;
      }

      const jobData = jobSnap.data();
      const userId = currentUser.uid;

      if (jobData.applicants && jobData.applicants.includes(userId)) {
        toast.warning("You have already applied for this job.", {
          position: "bottom-center",
          duration: 3000,
        });
        return;
      }

      await updateDoc(jobRef, {
        applicants: jobData.applicants ? arrayUnion(userId) : [userId],
        applicationsCount: (jobData.applicationsCount || 0) + 1,
      });

      setJob((prev) => ({
        ...prev,
        applicants: prev.applicants ? [...prev.applicants, userId] : [userId],
        applicationsCount: (prev.applicationsCount || 0) + 1,
      }));
      setIsApplied(true);
      toast.success("Applied successfully!", {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply. Please try again.", {
        position: "bottom-center",
        duration: 3000,
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty.", {
        position: "bottom-center",
        duration: 3000,
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
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.", {
        position: "bottom-center",
        duration: 3000,
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

    // Find the word at the cursor position (allowing spaces in usernames)
    const textBeforeCursor = value.slice(0, cursor);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtIndex + 1).trimStart();
      if (query || query === "") {
        const filteredSuggestions = users.filter((user) =>
          user.display.toLowerCase().includes(query.toLowerCase()),
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
      // Use only the first word of the username as the alias
      const alias = selectedUser.display.split(" ")[0];
      const newComment =
        comment.slice(0, lastAtIndex) +
        `@${alias} ` +
        comment.slice(cursorPosition);
      setComment(newComment);
      setSuggestions([]);
      textareaRef.current.focus();
      // Update cursor position to after the inserted alias
      setCursorPosition(lastAtIndex + alias.length + 2);
    }
  };

  const getInitialColor = (userName) => {
    const index = userName.charCodeAt(0) % initialColors.length;
    return initialColors[index];
  };

  // Function to render comment text with mentions in Facebook-like style, using alias (first word)
  const renderCommentText = (text) => {
    const mentionRegex = /@[\w\s]+?(?=\s|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + mention.length;

      // Extract the first word of the mention (after @)
      const mentionText = mention.slice(1).split(" ")[0];

      // Add text before the mention
      if (startIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="text-black">
            {text.slice(lastIndex, startIndex)}
          </span>,
        );
      }

      // Add the mention (first word only) in Facebook blue with light gray background
      parts.push(
        <span
          key={`mention-${startIndex}`}
          className="text-[#1877F2] bg-[#E8ECEF] px-1 rounded-sm font-medium"
        >
          {mentionText}
        </span>,
      );

      lastIndex = endIndex;
    }

    // Add remaining text after the last mention
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-black">
          {text.slice(lastIndex)}
        </span>,
      );
    }

    return parts;
  };

  return (
    <section className="min-h-screen bg-[#FFFBF5] py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-[#E8D8C4] shadow-lg hover:shadow-2xl transition-shadow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#B71C1C] mb-2">
              {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
            </h2>
            <p className="text-lg md:text-xl font-medium text-[#6D2932] mb-4">
              {job.company.charAt(0).toUpperCase() + job.company.slice(1)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#2D2D2D]">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Location: {job.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBriefcase /> <span>Type: {job.type || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock /> <span>Experience: {job.experience || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt />{" "}
              <span>Created: {formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt />{" "}
              <span>Deadline: {formatDate(job.deadline)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Level: {job.level || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Salary: {job.salary || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Views: {job.views || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Applications: {job.applicationsCount || "N/A"}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-[#B71C1C] mb-2">
              Description
            </h3>
            <p className="text-[#333] leading-relaxed break-words line-clamp-6 max-h-[12rem] overflow-hidden">
              {job.description || "No description available."}
            </p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#B71C1C] mb-2">
                Requirements
              </h3>
              <p className="text-[#333] leading-relaxed break-words line-clamp-4 max-h-[8rem] overflow-hidden">
                {job.requirements}
              </p>
            </div>
          )}

          {job.skills && (
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#B71C1C] mb-2">
                Skills
              </h3>
              <p className="text-[#333] leading-relaxed break-words line-clamp-4 max-h-[8rem] overflow-hidden">
                {job.skills}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {userRole === "freelancer" && (
              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-md ${
                  isApplied
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#B71C1C] text-white hover:bg-[#8B0000] hover:shadow-lg"
                }`}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            )}
            {["freelancer", "mentor"].includes(userRole) && (
              <button
                onClick={() => setIsCommentPopupOpen(true)}
                className={`${
                  userRole === "mentor" ? "w-32 mx-auto" : "flex-1"
                } text-center py-3 rounded-lg font-semibold bg-[#B71C1C] text-white hover:bg-[#8B0000] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg`}
              >
                Comment
              </button>
            )}
          </div>

          {/* Comment Popup */}
          {isCommentPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold text-[#B71C1C] mb-4">
                  {editingComment !== null ? "Edit Comment" : "Add a Comment"}
                </h3>
                {!loadingUsers ? (
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={comment}
                      onChange={handleInputChange}
                      placeholder="Type @ to mention someone..."
                      className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                      rows="4"
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {suggestions.map((user) => (
                          <li
                            key={user.id}
                            onClick={() => handleSuggestionSelect(user)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
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
                    className="flex-1 bg-[#B71C1C] text-white py-2 rounded-lg hover:bg-[#8B0000] transition-colors duration-200"
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
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Popup */}
          {isDeletePopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold text-[#B71C1C] mb-4">
                  Are you sure you want to delete this comment?
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDeleteComment(deleteCommentIndex)}
                    className="flex-1 bg-[#B71C1C] text-white py-2 rounded-lg hover:bg-[#8B0000] transition-colors duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setIsDeletePopupOpen(false);
                      setDeleteCommentIndex(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {job.comments && job.comments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#B71C1C] mb-2">
                Comments ({job.comments.length})
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
                      className="p-4 bg-gray-100 rounded-lg flex gap-4 relative"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${initialColor}`}
                        >
                          {initial}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-900 font-bold">{userName}</p>
                          {comment.userId === currentUser?.uid && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(index)}
                                className="text-gray-700 hover:text-gray-900"
                                title="Edit"
                              >
                                <FaPen />
                              </button>
                              <button
                                onClick={() => {
                                  setIsDeletePopupOpen(true);
                                  setDeleteCommentIndex(index);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-black">
                          {renderCommentText(comment.text)}
                        </p>
                        <p className="text-sm text-gray-600">
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
