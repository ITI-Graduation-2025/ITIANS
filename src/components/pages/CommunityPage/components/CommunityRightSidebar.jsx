import Image from "next/image";
import Link from "next/link";
import { HiOutlineCheckCircle, HiOutlineStar, HiOutlineTrophy } from "react-icons/hi2";

export default function CommunityRightSidebar({ freelancers, mentors, search }) {
  return (
    <aside className="space-y-6">
      {/* Top Freelancers */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <HiOutlineStar className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-white">Top Freelancers</h3>
          </div>
        </div>
        
        <div className="p-4">
          {freelancers.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No freelancers found.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {freelancers.map((freelancer, index) => (
                <Link
                  key={freelancer.name}
                  href={`/profile/${freelancer.id || freelancer.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 group">
                    <div className="relative flex-shrink-0">
                      {freelancer.profileImage ? (
                        <Image
                          src={freelancer?.profileImage}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all"
                          width={48}
                          height={48}
                          alt={freelancer.name || 'Freelancer'}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all">
                          {(freelancer.name || 'F').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 
                            ? "bg-yellow-500 text-white shadow-lg" 
                            : index === 1 
                            ? "bg-slate-400 text-white shadow-lg" 
                            : "bg-amber-600 text-white shadow-lg"
                        }`}>
                          {index === 0 ? "1" : index === 1 ? "2" : "3"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                        {freelancer.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        {freelancer.jobTitle || "ITI Graduate"}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-slate-400">
                      <HiOutlineStar className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-xs font-medium text-slate-600">
                        {freelancer.rating || "5.0"}
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Top Mentors */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <HiOutlineTrophy className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-white">Top Mentors</h3>
          </div>
        </div>
        
        <div className="p-4">
          {mentors && mentors.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No mentors found.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {mentors && mentors.map((mentor, index) => (
                <Link
                  key={mentor.name}
                  href={`/mentor/${mentor.id || mentor.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 group">
                    <div className="relative flex-shrink-0">
                      {mentor.profileImage ? (
                        <Image
                          src={mentor?.profileImage}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-slate-300 transition-all"
                          width={48}
                          height={48}
                          alt={mentor.name || 'Mentor'}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold ring-2 ring-slate-100 group-hover:ring-slate-300 transition-all">
                          {(mentor.name || 'M').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 
                            ? "bg-yellow-500 text-white shadow-lg" 
                            : index === 1 
                            ? "bg-slate-400 text-white shadow-lg" 
                            : "bg-amber-600 text-white shadow-lg"
                        }`}>
                          {index === 0 ? "1" : index === 1 ? "2" : "3"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate group-hover:text-slate-600 transition-colors">
                        {mentor.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        {mentor.jobTitle || "ITI Mentor"}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-slate-400">
                      <HiOutlineStar className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-xs font-medium text-slate-600">
                        {mentor.rating || "5.0"}
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">Community Stats</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-primary">2.5K+</div>
              <div className="text-xs text-slate-500 font-medium">Active Users</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-700">500+</div>
              <div className="text-xs text-slate-500 font-medium">Posts Today</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 