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
                    {freelancer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {freelancer.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {freelancer.role}
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

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg">Trending Hashtags</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              "ITI",
              "Freelancing",
              "WebDev",
              "ReactJS",
              "ITIGraduates",
              "Coding",
              "UXDesign",
              "MobileApps",
              "TechJobs",
              "RemoteWork",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg">Community Guidelines</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
              <span>Be respectful to all members</span>
            </li>
            <li className="flex items-start space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
              <span>Share knowledge and help others</span>
            </li>
            <li className="flex items-start space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
              <span>No spam or self-promotion</span>
            </li>
            <li className="flex items-start space-x-2">
              <HiOutlineCheckCircle className="w-5 h-5 text-primary" />
              <span>Keep discussions professional</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
} 