// Mock Data
export const mockUsers = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    role: "Freelancer",
    nationalId: "12345678901234",
    verificationStatus: "Approved",
    createdAt: "2024-01-15",
    // avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    role: "Company",
    nationalId: "98765432109876",
    verificationStatus: "Pending",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Sarah Mohamed",
    email: "sarah@example.com",
    role: "Mentor",
    nationalId: "11223344556677",
    verificationStatus: "Approved",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Omar Ali",
    email: "omar@example.com",
    role: "Freelancer",
    nationalId: "99887766554433",
    verificationStatus: "Rejected",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "InnovateLab",
    email: "contact@innovatelab.com",
    role: "Company",
    nationalId: "55443322110099",
    verificationStatus: "Approved",
    createdAt: "2024-01-18",
  },
];

export const mockJobs = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "TechCorp Solutions",
    companyId: "2",
    skills: ["React", "Node.js", "MongoDB"],
    status: "Open",
    applications: 15,
    createdAt: "2024-01-22",
    description: "Looking for an experienced full stack developer...",
  },
  {
    id: "2",
    title: "UI/UX Designer",
    company: "InnovateLab",
    companyId: "5",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    status: "Open",
    applications: 8,
    createdAt: "2024-01-20",
    description: "Creative UI/UX designer needed for mobile app...",
  },
  {
    id: "3",
    title: "Mobile App Developer",
    company: "TechCorp Solutions",
    companyId: "2",
    skills: ["Flutter", "React Native", "Firebase"],
    status: "Closed",
    applications: 23,
    createdAt: "2024-01-15",
    description: "Experienced mobile developer for cross-platform app...",
  },
];

export const mockMentorshipOffers = [
  {
    id: "1",
    mentorId: "3",
    mentorName: "Sarah Mohamed",
    field: "Frontend Development",
    availability: "Weekends",
    price: 0,
    isPaid: false,
    status: "Approved",
    createdAt: "2024-01-12",
  },
  {
    id: "2",
    mentorId: "3",
    mentorName: "Sarah Mohamed",
    field: "React.js",
    availability: "Evenings",
    price: 50,
    isPaid: true,
    status: "Pending",
    createdAt: "2024-01-25",
  },
];

export const mockMentorshipSessions = [
  {
    id: "1",
    mentorId: "3",
    mentorName: "Sarah Mohamed",
    menteeId: "1",
    menteeName: "Ahmed Hassan",
    date: "2024-02-05",
    meetingLink: "https://zoom.us/j/123456789",
    feedback: "Great session, very helpful!",
    status: "Completed",
  },
  {
    id: "2",
    mentorId: "3",
    mentorName: "Sarah Mohamed",
    menteeId: "4",
    menteeName: "Omar Ali",
    date: "2024-02-10",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "Scheduled",
  },
];

export const mockChats = [
  {
    id: "1",
    participants: ["1", "3"],
    participantNames: ["Ahmed Hassan", "Sarah Mohamed"],
    lastMessage: "Thank you for the mentorship session!",
    timestamp: "2024-01-28 14:30",
    isArchived: false,
  },
  {
    id: "2",
    participants: ["4", "3"],
    participantNames: ["Omar Ali", "Sarah Mohamed"],
    lastMessage: "When is our next session?",
    timestamp: "2024-01-28 10:15",
    isArchived: false,
  },
];

export const mockAnalytics = {
  totalUsers: {
    freelancers: 156,
    companies: 23,
    mentors: 18,
  },
  activeJobs: 45,
  mentorshipSessions: 89,
  recentActivity: [
    {
      type: "registration",
      user: "New freelancer registered",
      time: "2 hours ago",
    },
    { type: "job", user: "TechCorp posted new job", time: "4 hours ago" },
    {
      type: "mentorship",
      user: "Mentorship session completed",
      time: "6 hours ago",
    },
  ],
  userGrowth: [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 145 },
    { month: "Mar", users: 167 },
    { month: "Apr", users: 189 },
    { month: "May", users: 197 },
  ],
  jobsVsApplications: [
    { month: "Jan", jobs: 12, applications: 89 },
    { month: "Feb", jobs: 18, applications: 134 },
    { month: "Mar", jobs: 15, applications: 156 },
    { month: "Apr", jobs: 22, applications: 198 },
  ],
};
