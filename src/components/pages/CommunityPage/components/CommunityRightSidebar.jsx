import Image from "next/image";
import Link from "next/link";
import { HiOutlineCheckCircle, HiOutlineStar, HiOutlineTrophy } from "react-icons/hi2";

export default function CommunityRightSidebar({ freelancers, mentors, search }) {
  return (
    <aside className="space-y-6">
      {/* Top Freelancers */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
          <div className="relative flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
              <HiOutlineStar className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-white">Top Freelancers</h3>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
        </div>
        
        <div className="p-4">
          {freelancers.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">No freelancers found.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {freelancers.map((freelancer, index) => (
                <Link
                  key={freelancer.name}
                  href={`/profile/${freelancer.id || freelancer.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-2xl cursor-pointer transition-all duration-200 group">
                    <div className="relative flex-shrink-0">
                      {freelancer.profileImage ? (
                        <Image
                          src={freelancer?.profileImage}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-200 shadow-md"
                          width={48}
                          height={48}
                          alt={freelancer.name || 'Freelancer'}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-200 shadow-md">
                          {(freelancer.name || 'F').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                          index === 0 
                            ? "bg-chart-1 text-white" 
                            : index === 1 
                            ? "bg-muted-foreground text-white" 
                            : "bg-chart-3 text-white"
                        }`}>
                          {index === 0 ? "1" : index === 1 ? "2" : "3"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                        {freelancer.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {freelancer.jobTitle || "ITI Graduate"}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <HiOutlineStar className="w-4 h-4 fill-current text-chart-1" />
                      <span className="text-xs font-medium text-foreground">
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
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
        <div className="bg-gradient-to-r from-accent via-accent to-accent/90 px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-primary/20"></div>
          <div className="relative flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
              <HiOutlineTrophy className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-white">Top Mentors</h3>
          </div>
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
        
        <div className="p-4">
          {mentors.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiOutlineTrophy className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No mentors found.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {mentors.map((mentor, index) => (
                <Link
                  key={mentor.name}
                  href={`/profile/${mentor.id || mentor.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-2xl cursor-pointer transition-all duration-200 group">
                    <div className="relative flex-shrink-0">
                      {mentor.profileImage ? (
                        <Image
                          src={mentor?.profileImage}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-accent/20 group-hover:ring-accent/30 transition-all duration-200 shadow-md"
                          width={48}
                          height={48}
                          alt={mentor.name || 'Mentor'}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold ring-2 ring-accent/20 group-hover:ring-accent/30 transition-all duration-200 shadow-md">
                          {(mentor.name || 'M').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Ranking Badge */}
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                          index === 0 
                            ? "bg-chart-1 text-white" 
                            : index === 1 
                            ? "bg-muted-foreground text-white" 
                            : "bg-chart-3 text-white"
                        }`}>
                          {index === 0 ? "1" : index === 1 ? "2" : "3"}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate group-hover:text-accent transition-colors duration-200">
                        {mentor.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {mentor.jobTitle || "ITI Mentor"}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <HiOutlineStar className="w-4 h-4 fill-current text-chart-1" />
                      <span className="text-xs font-medium text-foreground">
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

      {/* Community Stats */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-5">
          <h3 className="font-bold text-lg text-foreground mb-4">Community Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Total Posts</span>
              </div>
              <span className="text-2xl font-bold text-primary">2.4k</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Active Users</span>
              </div>
              <span className="text-2xl font-bold text-accent">1.2k</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-chart-2/10 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-foreground">Success Rate</span>
              </div>
              <span className="text-2xl font-bold text-chart-2">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-chart-4/20 to-chart-5/20 px-6 py-5">
          <h3 className="font-bold text-lg text-foreground mb-4">Trending Topics</h3>
          <div className="space-y-3">
            {['Web Development', 'AI & Machine Learning', 'Mobile Apps', 'Data Science', 'Cybersecurity'].map((topic, index) => (
              <div key={topic} className="flex items-center justify-between p-3 bg-white/50 hover:bg-white/70 rounded-2xl transition-all duration-200 cursor-pointer group">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  #{topic}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-chart-4 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {Math.floor(Math.random() * 100) + 50} posts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 