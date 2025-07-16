"use client";

import {
  Star,
  MapPin,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Mail,
  Linkedin,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function ProfileViewCom() {
  const jobs = [
    {
      title: "Senior React Developer",
      rate: "$75-100/hr",
      duration: "3-6 months",
      proposals: 12,
      posted: "2 days ago",
      tags: ["JavaScript", "React", "Frontend"],
    },
    {
      title: "Mobile App Developer (Flutter)",
      rate: "$50-70/hr",
      duration: "2-4 months",
      proposals: 9,
      posted: "5 days ago",
      tags: ["Dart", "Flutter", "Mobile"],
    },
    {
      title: "DevOps Engineer",
      rate: "$80-120/hr",
      duration: "1-3 months",
      proposals: 13,
      posted: "1 week ago",
      tags: ["AWS", "Kubernetes", "Automation"],
    },
    {
      title: "UI/UX Designer",
      rate: "$50-70/hr",
      duration: "1-2 months",
      proposals: 22,
      posted: "3 days ago",
      tags: ["Adobe XD", "Figma", "Prototyping"],
    },
  ];

  const reviews = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      comment:
        "Excellent company to work with! Clear requirements, timely payments, and great communication throughout the project. The team is very professional and supportive.",
      project: "E-commerce Platform Development",
      posted: "2 weeks ago",
    },
    {
      name: "Marcus Rodriguez",
      role: "Mobile Developer",
      comment:
        "TechCore has been amazing to work with. They provided detailed specifications and were always available for questions. Highly recommend!",
      project: "iOS App Development",
      posted: "1 month ago",
    },
    {
      name: "Emma Thompson",
      role: "UI/UX Designer",
      comment:
        "Great experience working on their design project. The feedback was constructive and the team appreciated creative input. Would work with them again.",
      project: "Website Redesign",
      posted: "6 months ago",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="text-white p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/business-people-working-office_23-2148902353.jpg')",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkpKMiM5cKQVwbj6CZVRhg7FspTTypVjt8Nw&s"
              alt="TechCore Logo"
              width={48}
              height={48}
              className="rounded-md shadow bg-white"
            />
            <div>
              <h1 className="text-2xl font-bold">TechCore Solutions</h1>
              <p>Leading Digital Innovation Partner</p>
              <div className="flex space-x-2 text-sm mt-1 items-center">
                <MapPin className="w-4 h-4" /> San Francisco, CA
                <span>• Enterprise • 250+ employees • Founded 2019</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="flex items-center justify-end gap-1">
              <Star className="w-4 h-4 text-yellow-300" /> 4.9
            </p>
            <p className="text-sm">127 reviews</p>
            <button className="mt-2 px-4 py-1 bg-white text-blue-700 rounded shadow">
              Follow Company
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {/* Jobs */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">
            Active Job Postings{" "}
            <span className="text-sm text-gray-500">(4 open positions)</span>
          </h2>
          <div className="space-y-2">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white shadow rounded p-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600 flex gap-2">
                      {job.rate} • {job.duration} • {job.proposals} proposals
                    </p>
                    <div className="space-x-2 mt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{job.posted}</div>
                </div>
                <button className="text-blue-600 text-sm mt-1">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Company Statistics</h2>
            <ul className="text-sm mt-2 space-y-1">
              <li className="flex gap-2 items-center">
                <Briefcase className="w-4 h-4" /> 45 Active Projects
              </li>
              <li className="flex gap-2 items-center">
                <Users className="w-4 h-4" /> 320+ Total Hired
              </li>
              <li className="flex gap-2 items-center">
                <CheckCircle className="w-4 h-4" /> 98% Success Rate
              </li>
              <li className="flex gap-2 items-center">
                <Clock className="w-4 h-4" /> 2 hours Avg Response
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">About TechCore Solutions</h2>
            <p className="text-sm mt-1">
              TechCore Solutions is a leading digital transformation company
              specializing in cutting-edge web and mobile applications. We
              partner with businesses of all sizes to deliver innovative
              technology solutions that drive growth and efficiency.
            </p>
          </div>

          <div className="bg-white shadow rounded p-3">
            <h2 className="font-semibold">Core Services</h2>
            <ul className="text-sm mt-1 space-y-1 columns-2">
              <li>Web Development</li>
              <li>Cloud Architecture</li>
              <li>UI/UX Design</li>
              <li>Mobile App Development</li>
              <li>DevOps</li>
              <li>Database Design</li>
              <li>API Development</li>
            </ul>
          </div>

          <div className="bg-white shadow rounded p-3">
  <h2 className="font-semibold mb-2">Technologies We Use</h2>
  <div className="grid grid-cols-3 gap-2 text-sm">
    <div className="px-2 py-1 bg-gray-100 rounded text-center">React</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Node.js</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Python</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Flutter</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">AWS</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Docker</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">MongoDB</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">PostgreSQL</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">GraphQL</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">TypeScript</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Next.js</div>
    <div className="px-2 py-1 bg-gray-100 rounded text-center">Kubernetes</div>
  </div>
</div>


          <div className="bg-white shadow rounded p-3">
  <h2 className="font-semibold">Contact Information</h2>
  <div className="text-sm mt-1 space-y-1">
    <p>
      <Globe className="inline w-4 h-4 mr-1" />
      <a
        href="https://www.techcore-solutions.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        www.techcore-solutions.com
      </a>
    </p>
    <p>
      <Mail className="inline w-4 h-4 mr-1" />
      <a
        href="mailto:info@techcore-solutions.com"
        className="text-blue-600 hover:underline"
      >
        info@techcore-solutions.com
      </a>
    </p>
    <p>
      <Linkedin className="inline w-4 h-4 mr-1" />
      <a
        href="https://linkedin.com/company/techcore-solutions"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        linkedin.com/company/techcore-solutions
      </a>
    </p>
  </div>
</div>

        </div>
      </div>
      
    </main>
  );
}