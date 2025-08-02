import Image from "next/image";
import Link from "next/link";

export default function CommunitySidebar({ currentUser, posts, companies = [] }) {
  if (!currentUser) {
    return <div>Loading user...</div>;
  }
  return (
    <aside className="w-full md:w-1/4 space-y-6">
      <div className="bg-card rounded-xl shadow-md overflow-hidden border-l-4 border-primary">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              {currentUser.profileImage ? (
                                   <Image
                                     src={currentUser?.profileImage}
                                     className="h-12 w-12 rounded-full object-cover"
                                     width={100}
                                     height={100}
                                     alt={currentUser.role}
                                   />
                                 ) : (
                                   <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                     {currentUser?.profileImage}
                                   </div>
                                 )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentUser?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentUser?.role}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between">
            <div className="text-center">
              <div className="font-bold">
                {posts.filter((p) => p.authorId === (currentUser?.uid || currentUser?.id)).length}
              </div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold">128</div>
              <div className="text-xs text-muted-foreground">
                Connections
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold">5</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg">ITI Companies</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {companies.length > 0 ? (
              companies.map((company) => (
                <Link
                  key={company.id || company.uid}
                  href={`/company/${company.id || company.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 hover:text-primary cursor-pointer transition-colors">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary">
                      {(company.name || company.companyName || "C").charAt(0)}
                    </div>
                    <span>{company.name || company.companyName || "Company"}</span>
                  </li>
                </Link>
              ))
            ) : (
              <li className="text-muted-foreground text-sm">No companies available</li>
            )}
          </ul>
        </div>
      </div>

      
    </aside>
  );
} 