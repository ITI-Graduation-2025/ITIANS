import Image from "next/image";
import Link from "next/link";

export default function CommunitySidebar({ currentUser, posts, companies = [] }) {
  if (!currentUser) {
    return (
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 text-center backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <aside className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
          <div className="relative flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">Your Profile</h3>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {currentUser.profileImage ? (
              <Image
                src={currentUser?.profileImage}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-primary/20 shadow-lg group-hover:ring-primary/30 transition-all duration-300"
                width={64}
                height={64}
                alt={currentUser.jobTitle}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl ring-4 ring-primary/20 shadow-lg group-hover:ring-primary/30 transition-all duration-300">
                {(currentUser?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground truncate">{currentUser?.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {currentUser?.jobTitle || "ITI Graduate"}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center group">
              <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-200">
                {posts.filter((p) => p.authorId === (currentUser?.uid || currentUser?.id)).length}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Posts</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-200">128</div>
              <div className="text-xs text-muted-foreground font-medium">Connections</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-200">5</div>
              <div className="text-xs text-muted-foreground font-medium">Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* ITI Companies */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
        <div className="bg-gradient-to-r from-accent via-accent to-accent/90 px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-primary/20"></div>
          <div className="relative flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">ITI Companies</h3>
          </div>
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
        </div>
        
        <div className="p-4">
          {companies.length > 0 ? (
            <ul className="space-y-3">
              {companies.map((company) => (
                <Link
                  key={company.id || company.uid}
                  href={`/companies/${company.id || company.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-2xl cursor-pointer transition-all duration-200 group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white font-bold text-sm ring-2 ring-accent/20 group-hover:ring-accent/30 transition-all duration-200">
                      {(company.name || company.companyName || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                        {company.name || company.companyName || "Company"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {company.industry || "Technology"}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">No companies found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-5">
          <h3 className="font-bold text-lg text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl transition-all duration-200 hover:scale-105 group">
              <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">Create Post</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-2xl transition-all duration-200 hover:scale-105 group">
              <div className="h-8 w-8 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-200">
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-medium">Find Mentors</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 bg-chart-2/10 hover:bg-chart-2/20 text-chart-2 rounded-2xl transition-all duration-200 hover:scale-105 group">
              <div className="h-8 w-8 bg-chart-2/20 rounded-lg flex items-center justify-center group-hover:bg-chart-2/30 transition-colors duration-200">
                <svg className="h-4 w-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">Browse Jobs</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
} 