'use client';

import Image from 'next/image';
import { Star, School, Languages, Clock ,Github, Linkedin } from 'lucide-react';
import Navbar from './Navbar';
import Link from 'next/link';
import { useState } from 'react';

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('completed');

  const jobs = [
    { title: 'Graphic designer …', date: 'Jan 14, 2022', description: '...', price: '$2,000', status: 'completed' },
    { title: 'Directory Website Pages …', date: 'Mar 14, 2021', description: '...', price: '$800', status: 'completed' },
    { title: 'Brand identity design …', date: 'Jun 10, 2024', description: '...', price: '$500', status: 'inprogress' },
  ];

  const red = '#E4002B';
  const darkRed = '#C10024';
  const filteredJobs = jobs.filter(j => activeTab === 'completed' ? j.status === 'completed' : j.status === 'inprogress');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
       <Navbar />
      {/* Header */}
      <div className="relative w-full h-72">
        <Image
          src="/bacground.png"
          alt="Header Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Profile summary */}
      <div className="relative max-w-6xl mx-auto -mt-28 bg-white rounded-lg shadow-lg p-6 border border-gray-200 z-10">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl">🧑‍🎨</div>
          <div>
            <h2 className="text-2xl  text-black"> Mohamed</h2>
            <p className="text-sm text-gray-600">Graphic designer</p>
            <p className="text-sm text-gray-600">Ui&uxTrack-Smart villlage Branch</p>
            <p className="text-sm text-gray-600">mohamed@gmail.com</p>
            
          </div>
          <button
            className="ml-auto text-white px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Message
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 text-center text-sm text-gray-800 mt-6">
          <div><p className="font-bold">$100+</p><p>Total Earnings</p></div>
          <div><p className="font-bold">15</p><p>Total Jobs</p></div>
          <div><p className="font-bold">52</p><p>Total Hours</p></div>
          <div><p className="font-bold">4.8 / 5</p><p>Total Ratings</p></div>
        </div>

        {/* About */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">About Me</h3>
          <p className="text-sm text-gray-700">Hi, My name is Mostaq! I'm an enthusiastic creative graphic artist...</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-8 px-2 flex flex-col lg:flex-row gap-6">
        {/* Left: Work History */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-600 border-b pb-2">Work History</h3>
          <div className="flex gap-6 mt-4 mb-2 text-sm">
            <button onClick={() => setActiveTab('completed')} className={`pb-1 border-b-2 ${activeTab === 'completed' ? 'text-red-600 border-red-600 font-semibold' : 'text-gray-400 border-transparent'}`}>
              Completed ({jobs.filter(j => j.status === 'completed').length})
            </button>
            <button onClick={() => setActiveTab('inprogress')} className={`pb-1 border-b-2 ${activeTab === 'inprogress' ? 'text-red-600 border-red-600 font-semibold' : 'text-gray-400 border-transparent'}`}>
              In Progress ({jobs.filter(j => j.status === 'inprogress').length})
            </button>
          </div>

          {/* Jobs */}
          {filteredJobs.length === 0 && <p className="text-gray-500 mt-2">No jobs here.</p>}
          {filteredJobs.map((job, i) => (
            <div key={i} className="bg-white p-4 shadow-sm mb-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />)}
                <span className="ml-2 text-gray-500">{job.date}</span>
              </div>
              <h4 className="font-semibold mt-2 text-red-600">{job.title}</h4>
              <p className="text-sm text-gray-700 mt-1">{job.description}</p>
              <p className="text-red-600 font-semibold mt-2">{job.price}</p>
            </div>
          ))}
        </div>

        {/* Sidebar Cards */}
        <div className="w-full lg:w-[300px] space-y-4">
          {/* Education Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <School size={20} className="text-red-600 mr-2" />
              <h4 className="font-semibold text-base">Education & Certificates</h4>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><p className="font-medium">ITI Electrician Certificate</p><p className="text-xs text-gray-500">Government ITI Pune – 2023</p></li>
              <li><p className="font-medium">Basic Safety Training</p><p className="text-xs text-gray-500">National Safety Council – 2023</p></li>
              <li><p className="font-medium">Electrical Measurements</p><p className="text-xs text-gray-500">Skill Development Center – 2024</p></li>
            </ul>
          </div>

          {/* Languages Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <Languages size={20} className="text-red-600 mr-2" />
              <h4 className="font-semibold text-base">Languages</h4>
            </div>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li className="flex justify-between"><span>Hindi</span><span>Native</span></li>
              <li className="flex justify-between"><span>English</span><span>Intermediate</span></li>
              <li className="flex justify-between"><span>Marathi</span><span>Native</span></li>
            </ul>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <Clock size={20} className="text-red-600 mr-2" />
              <h4 className="font-semibold text-base">Availability</h4>
            </div>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li className="flex justify-between"><span>Status</span><span className="text-green-600 font-medium">Available</span></li>
              <li className="flex justify-between"><span>Response Time</span><span>Within 12 hours</span></li>
              <li className="flex justify-between"><span>Work Hours</span><span>8 AM – 5 PM</span></li>
              <li className="flex justify-between"><span>Hourly Rate</span><span>₹200 – 300/hr</span></li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 h-40 ">
  <div className="flex items-center mb-3">
    <Github size={20} className="text-red-600 mr-2" />
    <h4 className="font-semibold text-base">Social Profiles</h4>
  </div>
  <ul className="space-y-2 text-sm text-gray-700">
    <li className="flex items-center gap-2">
      <Github size={16} className="text-gray-600" />
      <Link href="https://github.com/yourusername" target="_blank" className="hover:underline text-blue-600">
        github.com/yourusername
      </Link>
    </li>
    <li className="flex items-center gap-2">
      <Linkedin size={16} className="text-gray-600" />
      <Link href="https://linkedin.com/in/yourusername" target="_blank" className="hover:underline text-blue-600">
        linkedin.com/in/yourusername
      </Link>
    </li>
  </ul>
</div>
      </div>
    </div>
  );
}