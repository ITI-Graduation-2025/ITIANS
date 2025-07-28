export default function CommunityFooter() {
  return (
    <footer className="bg-primary text-primary-foreground py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img
              src="/logo.jpeg"
              alt="ITI Logo"
              className="h-10 w-10 object-contain rounded-full border border-border bg-card mr-2"
            />
            <h1 className="text-2xl font-bold">ITI Freelancers Community</h1>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-primary-foreground/80 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-center md:text-left text-sm text-primary-foreground/80">
          © {new Date().getFullYear()} ITI Freelancers Community. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
} 