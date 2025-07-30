export default function CommunitySidebar({ currentUser, posts }) {
  if (!currentUser) {
    return <div>Loading user...</div>;
  }
  return (
    <aside className="w-full md:w-1/4 space-y-6">
      <div className="bg-card rounded-xl shadow-md overflow-hidden border-l-4 border-primary">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              {currentUser?.avatar}
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
            {[
              "Valeo",
              "ITWorx",
              "Orange Labs",
              "Sumerge",
              "IBM Egypt",
              "Microsoft Egypt",
            ].map((company) => (
              <li
                key={company}
                className="flex items-center space-x-3 hover:text-primary cursor-pointer transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary">
                  {company.charAt(0)}
                </div>
                <span>{company}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg">Upcoming Events</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-4">
            <li className="hover:bg-muted p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="min-w-12 h-12 bg-secondary rounded-lg flex items-center justify-center font-bold text-secondary-foreground">
                  Jul
                </div>
                <div>
                  <div className="font-medium">ITI Alumni Meetup</div>
                  <div className="text-sm text-muted-foreground">
                    July 15, 2023 • Cairo
                  </div>
                </div>
              </div>
            </li>
            <li className="hover:bg-muted p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="min-w-12 h-12 bg-secondary rounded-lg flex items-center justify-center font-bold text-secondary-foreground">
                  Jul
                </div>
                <div>
                  <div className="font-medium">Freelancing Workshop</div>
                  <div className="text-sm text-muted-foreground">
                    July 20, 2023 • Online
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
} 