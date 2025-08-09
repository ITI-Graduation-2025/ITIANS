"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaSearch, FaChevronDown } from "react-icons/fa";
import { MdWork, MdSchool, MdPeople, MdChat } from "react-icons/md";
import UserInfo from "../pages/userInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import debounce from "lodash/debounce";

const categories = [
  { name: "Jobs", href: "/jobs", icon: <MdWork className="w-6 h-6" /> },
  { name: "Mentors", href: "/mentors", icon: <MdSchool className="w-6 h-6" /> },
  { name: "Users", href: "/users", icon: <MdPeople className="w-6 h-6" /> },
  { name: "Messages", href: "/chat", icon: <MdChat className="w-6 h-6" /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef(null);

  useEffect(() => {
    let scope = "all";
    if (pathname === "/") {
      scope = "all";
    } else if (pathname.startsWith("/jobs")) {
      scope = "jobs";
    } else if (pathname.startsWith("/mentors")) {
      scope = "mentors";
    } else if (pathname.startsWith("/users")) {
      scope = "users";
    } else if (pathname.startsWith("/chat")) {
      scope = "messages";
    }
    setSearchScope(scope);
    setSearchQuery("");
    setSearchResults([]);
    console.log("Current pathname:", pathname, "Scope:", scope);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (term, scope) => {
      if (!term) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      let results = [];
      try {
        if (scope === "all") {
          const jobsQuery = query(collection(db, "jobs"));
          const mentorsQuery = query(
            collection(db, "users"),
            where("role", "==", "mentor"),
          );
          const usersQuery = query(collection(db, "users"));
          const [jobsSnapshot, mentorsSnapshot, usersSnapshot] =
            await Promise.all([
              getDocs(jobsQuery),
              getDocs(mentorsQuery),
              getDocs(usersQuery),
            ]);

          const jobsResults = jobsSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "jobs", ...doc.data() }))
            .filter(
              (job) =>
                job.title?.toLowerCase().includes(term.toLowerCase()) ||
                job.company?.toLowerCase().includes(term.toLowerCase()),
            );
          const mentorsResults = mentorsSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "mentors", ...doc.data() }))
            .filter((mentor) =>
              mentor.name?.toLowerCase().includes(term.toLowerCase()),
            );
          const usersResults = usersSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "users", ...doc.data() }))
            .filter(
              (user) =>
                user.name?.toLowerCase().includes(term.toLowerCase()) ||
                user.email?.toLowerCase().includes(term.toLowerCase()),
            );
          const messagesResults = usersSnapshot.docs
            .map((doc) => ({ id: doc.id, type: "messages", ...doc.data() }))
            .filter((user) =>
              user.name?.toLowerCase().includes(term.toLowerCase()),
            );

          results = [
            ...jobsResults,
            ...mentorsResults,
            ...usersResults,
            ...messagesResults,
          ];
          console.log("All results:", results);
        } else if (scope === "jobs") {
          const q = query(collection(db, "jobs"));
          const querySnapshot = await getDocs(q);
          results = querySnapshot.docs
            .map((doc) => ({ id: doc.id, type: "jobs", ...doc.data() }))
            .filter(
              (job) =>
                job.title?.toLowerCase().includes(term.toLowerCase()) ||
                job.company?.toLowerCase().includes(term.toLowerCase()),
            );
          console.log("Jobs results:", results);
        } else if (scope === "mentors") {
          const q = query(
            collection(db, "users"),
            where("role", "==", "mentor"),
          );
          const querySnapshot = await getDocs(q);
          results = querySnapshot.docs
            .map((doc) => ({ id: doc.id, type: "mentors", ...doc.data() }))
            .filter((mentor) =>
              mentor.name?.toLowerCase().includes(term.toLowerCase()),
            );
          console.log("Mentors results:", results);
        } else if (scope === "users") {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          results = querySnapshot.docs
            .map((doc) => ({ id: doc.id, type: "users", ...doc.data() }))
            .filter(
              (user) =>
                user.name?.toLowerCase().includes(term.toLowerCase()) ||
                user.email?.toLowerCase().includes(term.toLowerCase()),
            );
          console.log("Users results:", results);
        } else if (scope === "messages") {
          const q = query(collection(db, "users"));
          const querySnapshot = await getDocs(q);
          results = querySnapshot.docs
            .map((doc) => ({ id: doc.id, type: "messages", ...doc.data() }))
            .filter((user) =>
              user.name?.toLowerCase().includes(term.toLowerCase()),
            );
          console.log("Messages results:", results);
        }
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [pathname],
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchQuery(term);
    performSearch(term, searchScope);
  };

  const handleScopeChange = (scope) => {
    setSearchScope(scope);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <nav className="bg-transparent backdrop-blur-md text-gray-800 font-semibold shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo and ITIANS */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ITIANS Logo"
            className="h-16 w-16 rounded-full"
          />
          {/* <span className="text-2xl font-bold tracking-tight text-[var(--primary)]">
            ITIANS
          </span> */}
        </Link>

        {/* Desktop View */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-base text-gray-800 hover:text-[#B71C1C] transition-colors duration-200 ml-12">
              Explore
              <FaChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-800 border border-gray-200 shadow-lg rounded-lg w-80">
              <div className="grid grid-cols-2 gap-6 p-4">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link
                      href={category.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm bg-gray-50 hover:bg-[#B71C1C] hover:text-white transition-colors duration-200 rounded-lg"
                    >
                      {category.icon}
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar with Filters */}
          <div
            className="relative flex items-center gap-4 max-w-2xl flex-1 justify-center"
            ref={searchRef}
          >
            <div className="relative w-full max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={`Search ${searchScope === "all" ? "everything" : searchScope}...`}
                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#B71C1C] transition duration-200 shadow-sm"
              />
            </div>
            {pathname === "/" && (
              <select
                value={searchScope}
                onChange={(e) => handleScopeChange(e.target.value)}
                className="px-3 py-2 rounded-full bg-gray-100 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#B71C1C] transition duration-200 shadow-sm"
              >
                <option value="all">All</option>
                <option value="jobs">Jobs</option>
                <option value="mentors">Mentors</option>
                <option value="users">Users</option>
                <option value="messages">Chats</option>
              </select>
            )}
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={
                      result.type === "jobs"
                        ? `/jobs/${result.id}`
                        : result.type === "mentors"
                          ? `/mentor/${result.id}`
                          : result.type === "users" ||
                              result.type === "messages"
                            ? `/chat/${result.id}`
                            : "#"
                    }
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    {result.profileImage ? (
                      <img
                        src={result.profileImage}
                        alt={result.name || result.title}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#B71C1C] flex items-center justify-center text-white text-sm">
                        {(result.name || result.title || "U")[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {result.title ||
                          result.name ||
                          result.email ||
                          "Result"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.type === "jobs"
                          ? result.company
                          : result.type === "mentors"
                            ? "Mentor"
                            : result.type === "users" ||
                                result.type === "messages"
                              ? result.email
                              : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 text-gray-500">
                Searching...
              </div>
            )}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 text-gray-500">
                No results found
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-gray-800 hover:text-[#B71C1C] transition-colors duration-200">
            <UserInfo />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-6">
          <ul className="flex flex-col items-center gap-6">
            {/* Explore Menu for Mobile */}
            <div className="grid grid-cols-2 gap-6 w-full px-6">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-800 hover:text-[#B71C1C] bg-gray-50 hover:bg-[#B71C1C] hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                </li>
              ))}
            </div>
            {/* Mobile Search Bar */}
            <li className="w-full px-6" ref={searchRef}>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={`Search ${searchScope === "all" ? "everything" : searchScope}...`}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#B71C1C] transition duration-200 shadow-sm"
                />
              </div>
              {pathname === "/" && (
                <select
                  value={searchScope}
                  onChange={(e) => handleScopeChange(e.target.value)}
                  className="w-full mt-3 px-4 py-3 rounded-full bg-gray-100 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#B71C1C] transition duration-200 shadow-sm"
                >
                  <option value="all">All</option>
                  <option value="jobs">Jobs</option>
                  <option value="mentors">Mentors</option>
                  <option value="users">Users</option>
                  <option value="messages">Messages</option>
                </select>
              )}
              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={
                        result.type === "jobs"
                          ? `/jobs/${result.id}`
                          : result.type === "mentors"
                            ? `/mentor/${result.id}`
                            : result.type === "users" ||
                                result.type === "messages"
                              ? `/chat/${result.id}`
                              : "#"
                      }
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {result.profileImage ? (
                        <img
                          src={result.profileImage}
                          alt={result.name || result.title}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#B71C1C] flex items-center justify-center text-white text-sm">
                          {(result.name ||
                            result.title ||
                            "U")[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {result.title ||
                            result.name ||
                            result.email ||
                            "Result"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.type === "jobs"
                            ? result.company
                            : result.type === "mentors"
                              ? "Mentor"
                              : result.type === "users" ||
                                  result.type === "messages"
                                ? result.email
                                : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {isSearching && (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-gray-500">
                  Searching...
                </div>
              )}
              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-gray-500">
                  No results found
                </div>
              )}
            </li>
            <li className="text-gray-800 hover:text-[#B71C1C] transition-colors duration-200">
              <UserInfo />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
