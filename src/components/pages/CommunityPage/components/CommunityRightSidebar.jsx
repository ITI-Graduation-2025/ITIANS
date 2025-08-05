import Image from "next/image";
import Link from "next/link";
import { HiOutlineCheckCircle } from "react-icons/hi2";

export default function CommunityRightSidebar({ freelancers, mentors, search }) {
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
                <Link
                  key={freelancer.name}
                  href={`/profile/${freelancer.id || freelancer.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {freelancer.profileImage ? (
                        <Image
                          src={freelancer?.profileImage}
                          className="h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                          alt={freelancer.name || 'Freelancer'}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {(freelancer.name || 'F').charAt(0)}
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
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-secondary text-secondary-foreground">
          <h3 className="font-bold text-lg">Top Mentors</h3>
        </div>
        <div className="p-4">
          {mentors && mentors.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No mentors found.
            </div>
          ) : (
            <ul className="space-y-3">
              {mentors && mentors.map((mentor, index) => (
                <Link
                  key={mentor.name}
                  href={`/mentor/${mentor.id || mentor.uid}`}
                  className="block"
                >
                  <li className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      {mentor.profileImage ? (
                        <Image
                          src={mentor?.profileImage}
                          className="h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                          alt={mentor.name || 'Mentor'}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                          {(mentor.name || 'M').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {mentor.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {mentor.jobTitle || ""}
                      </div>
                    </div>
                    {index < 3 && (
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? "bg-secondary/10 text-secondary" : index === 1 ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
} 