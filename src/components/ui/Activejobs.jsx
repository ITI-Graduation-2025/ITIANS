// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import CompanyNavbar from "./CompanyNavbar";

// // Import icons
// import { FiClipboard, FiClock, FiCheckCircle } from "react-icons/fi";

// export default function ActiveJobs() {
//   const { data: session } = useSession();
//   const companyId = session?.user?.id;
//   const [jobs, setJobs] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (!companyId) return;

//     const fetchJobs = async () => {
//       const jobsRef = collection(db, "jobs");
//       const q = query(jobsRef, where("companyId", "==", companyId));
//       const querySnapshot = await getDocs(q);

//       const jobList = [];

//       for (const docSnap of querySnapshot.docs) {
//         const job = docSnap.data();
//         const approvedFreelancers = job.applicants?.filter(
//           (app) => app.status === "approved" || app.status === "completed"
//         );

//         if (approvedFreelancers && approvedFreelancers.length > 0) {
//           const freelancersData = [];

//           for (const approved of approvedFreelancers) {
//             let freelancerData = {
//               name: approved.name || "Unknown",
//               avatar:
//                 approved.profileImage ||
//                 approved.avatar ||
//                 "https://via.placeholder.com/50",
//               role: approved.role || "Freelancer",
//               userId: approved.userId,
//               completed: approved.status === "completed",
//               paidToAdmin: approved.paidToAdmin || false,
//               status: approved.status || "approved",
//             };

//             if (approved.userId) {
//               const userRef = doc(db, "users", approved.userId);
//               const userSnap = await getDoc(userRef);
//               if (userSnap.exists()) {
//                 const userInfo = userSnap.data();
//                 freelancerData = {
//                   ...freelancerData,
//                   name: userInfo.name || freelancerData.name,
//                   avatar:
//                     userInfo.photoURL ||
//                     userInfo.avatar ||
//                     userInfo.profileImage ||
//                     userInfo.image ||
//                     freelancerData.avatar,
//                   role: userInfo.role || freelancerData.role,
//                 };
//               }
//             }

//             const progress = freelancerData.completed ? 100 : 0;
//             freelancersData.push({ ...freelancerData, progress, salary: job.salary });
//           }

//           jobList.push({
//             id: docSnap.id,
//             title: job.title,
//             freelancers: freelancersData,
//           });
//         }
//       }

//       setJobs(jobList);
//     };

//     fetchJobs();
//   }, [companyId]);

//   const handlePayment = async (jobId, applicantId, salary) => {
//     try {
//       const jobRef = doc(db, "jobs", jobId);
//       const jobSnap = await getDoc(jobRef);
//       if (!jobSnap.exists()) return;

//       const jobData = jobSnap.data();
//       const updatedApplicants = jobData.applicants.map((app) =>
//         app.userId === applicantId
//           ? { ...app, paidToAdmin: true, paidAt: Timestamp.now() }
//           : app
//       );

//       await updateDoc(jobRef, { applicants: updatedApplicants });

//       alert(`Payment of ${salary} sent to admin successfully!`);
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("An error occurred during payment");
//     }
//   };

//   const filteredJobs = jobs
//     .map((job) => {
//       let filteredFreelancers = job.freelancers;

//       if (filter === "inProgress") {
//         filteredFreelancers = job.freelancers.filter(
//           (f) => f.status === "approved" && !f.completed
//         );
//       } else if (filter === "completed") {
//         filteredFreelancers = job.freelancers.filter((f) => f.completed);
//       }

//       return { ...job, freelancers: filteredFreelancers };
//     })
//     .filter((job) => job.freelancers.length > 0)
//     .filter(
//       (job) =>
//         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.freelancers.some((f) =>
//           f.name.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );

//   const filterIcons = {
//     all: <FiClipboard size={20} />,
//     inProgress: <FiClock size={20} />,
//     completed: <FiCheckCircle size={20} />,
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-100">
//       {/* Company Navbar */}
//       <CompanyNavbar />

//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 p-4 bg-white mt-1 flex-shrink-0">
//           <div className="text-center mb-6">
//   <h2 className="text-2xl md:text-2xl font-extrabold text-gray-900 mb-2">
//     Active Jobs
//   </h2>
//   <p className="text-gray-600 text-sm md:text-base">
//     Overview of all approved freelancers and their current progress on your jobs
//   </p>
//   <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mt-3"></div>
// </div>

//           <div className="flex flex-col gap-2">
//             {["all", "inProgress", "completed"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
//                   filter === f
//                     ? "bg-slate-800 text-white shadow-md "
//                     : "bg-white hover:bg-red-100 border-gray-300"
//                 }`}
//               >
//                 {filterIcons[f]}
//                 <span className="capitalize">
//                   {f === "all"
//                     ? "All"
//                     : f === "inProgress"
//                     ? "In Progress"
//                     : "Completed"}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6">
//           <div className="mb-6 flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-800">Freelancer Overview</h1>

//             <input
//               type="text"
//               placeholder="Search by job title or freelancer name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-64 p-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
//             />
//           </div>

//           {filteredJobs.length === 0 ? (
//             <p className="text-gray-500">No jobs match this filter</p>
//           ) : (
//             filteredJobs.map((job) =>
//               job.freelancers.map((freelancer) => (
//                 <div
//                   key={`${job.id}-${freelancer.userId}`}
//                   className="bg-white p-5 rounded-xl shadow-md mb-4 flex justify-between items-center transition hover:shadow-lg"
//                 >
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>

//                     <div className="mt-3">
//                       <p className="text-sm text-gray-700">
//                         Salary: <span className="font-medium">${freelancer.salary}</span>
//                       </p>

//                       <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
//                         <div
//                           className={`h-3 ${
//                             freelancer.completed
//                               ? freelancer.paidToAdmin
//                                 ? "bg-green-500"
//                                 : "bg-yellow-400"
//                               : "bg-blue-400"
//                           } transition-all duration-500`}
//                           style={{ width: `${freelancer.progress}%` }}
//                         ></div>
//                       </div>

//                       <p className="text-xs mt-1 text-gray-600">
//                         {freelancer.completed
//                           ? freelancer.paidToAdmin
//                             ? "Completed & Paid"
//                             : "Completed & Not Paid"
//                           : "In Progress"}
//                       </p>

//                       <button
//                         onClick={() =>
//                           handlePayment(job.id, freelancer.userId, freelancer.salary)
//                         }
//                         className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
//                       >
//                         Pay to Admin
//                       </button>
//                     </div>
//                   </div>

//                   <div className="ml-4 flex flex-col items-center">
//                     <img
//                       src={freelancer.avatar}
//                       alt={freelancer.name}
//                       className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200"
//                     />
//                     <span className="text-sm font-medium text-gray-800">{freelancer.name}</span>
//                     <span className="text-xs text-gray-500">{freelancer.role}</span>
//                   </div>
//                 </div>
//               ))
//             )
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }









