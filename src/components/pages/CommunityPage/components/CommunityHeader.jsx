import { Header } from "@/components/mentorComp/header";
import { HiOutlineBell, HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function CommunityHeader({ search, setSearch, currentUser }) {
  return (
    // <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-10">
    //   <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    //     <div className="flex items-center space-x-2 mb-4 md:mb-0">
    //       <img
    //         src="/logo.jpeg"
    //         alt="ITI Logo"
    //         className="h-10 w-10 object-contain rounded-full border border-border bg-card mr-2"
    //       />
    //       <h1 className="text-2xl font-bold">ITI Freelancers Community</h1>
    //     </div>

    //     <div className="flex items-center space-x-4">
    //       <div className="relative">
    //         <input
    //           type="text"
    //           placeholder="Search posts or freelancers..."
    //           className="px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background/80"
    //           value={search}
    //           onChange={(e) => setSearch(e.target.value)}
    //         />
    //         <span className="absolute right-3 top-2.5 text-muted-foreground">
    //           <HiOutlineMagnifyingGlass className="w-5 h-5" />
    //         </span>
    //       </div>
    //       <button className="p-2 rounded-full hover:bg-primary/80 transition-colors">
    //         <HiOutlineBell className="w-6 h-6" />
    //       </button>
    //       <div className="h-10 w-10 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground font-medium">
    //         {currentUser?.avatar}
    //       </div>
    //     </div>
    //   </div>
    // </header>
    <Header/>
  );
} 