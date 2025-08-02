import Image from "next/image";
import { HiOutlineCheckCircle } from "react-icons/hi2";

export default function CommunityRightSidebar({ freelancers, search }) {
  return (
    <aside className="w-full md:w-1/4 space-y-6">
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg">Top Freelancers</h3>
        </div>
        <div className="p-4">
          {freelancers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No freelancers found.
            </div>
          ) : (
            <ul className="space-y-3">
              {freelancers.map((freelancer, index) => (
                <li
                  key={freelancer.name}
                  className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {freelancer.profileImage ? (
                                         <Image
                                           src={freelancer?.profileImage}
                                           className="h-12 w-12 rounded-full object-cover"
                                           width={100}
                                           height={100}
                                           alt={freelancer.role}
                                         />
                                       ) : (
                                         <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                           {freelancer?.profileImage}
                                         </div>
                                       )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {freelancer.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {freelancer.jobTitle}
                    </div>
                  </div>
                  {index < 3 && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? "bg-primary/10 text-primary" : index === 1 ? "bg-muted text-muted-foreground" : "bg-secondary/10 text-secondary"}`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
} 