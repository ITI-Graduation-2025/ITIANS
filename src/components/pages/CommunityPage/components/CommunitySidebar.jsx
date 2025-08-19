import Image from "next/image";
import Link from "next/link";

export default function CommunitySidebar({ currentUser, posts, companies = [] }) {
  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <aside className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">Your Profile</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {currentUser.profileImage ? (
              <Image
                src={currentUser?.profileImage}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-slate-100"
                width={64}
                height={64}
                alt={currentUser.jobTitle}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-slate-100">
                {(currentUser?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-800 truncate">{currentUser?.name}</h3>
              <p className="text-sm text-slate-600 truncate">
                {currentUser?.jobTitle || "ITI Graduate"}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {posts.filter((p) => p.authorId === (currentUser?.uid || currentUser?.id)).length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">128</div>
              <div className="text-xs text-slate-500 font-medium">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">5</div>
              <div className="text-xs text-slate-500 font-medium">Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* ITI Companies */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white">ITI Companies</h3>
          </div>
        </div>
        
        <div className="p-4">
          {companies.length > 0 ? (
            <ul className="space-y-2">
              {companies.map((company) => (
                <Link
                  key={company.id || company.uid}
                  href={`/companies/${company.id || company.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 group">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all">
                      {(company.name || company.companyName || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-slate-700 group-hover:text-primary transition-colors truncate block">
                        {company.name || company.companyName || "Company"}
                      </span>
                      <span className="text-xs text-slate-500">ITI Partner</span>
                    </div>
                    <svg className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No companies available</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
} 