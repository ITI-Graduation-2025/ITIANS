"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import UserInfo from "../pages/userInfo";

const navLinks = [
  { name: "Home", href: "" },
  { name: "Jobs", href: "/jobs" },
  { name: "Mentors", href: "/mentors" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      navLinks.forEach((link) => {
        const section = document.querySelector(link.href.replace("/#", "#"));
        if (section) {
          const offsetTop = section.offsetTop - 80;
          const offsetBottom = offsetTop + section.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveLink(link.href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="bg-[#B71C1C]/80 backdrop-blur-lg text-white font-bold shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="ITIANS Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-wide">ITIANS</span>
        </div>

        <ul className="hidden md:flex justify-center flex-1 gap-8 text-sm items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`transition-colors duration-200 ${
                  activeLink === link.href
                    ? "text-[#E57373]"
                    : "hover:text-[#E57373]"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <UserInfo />
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 bg-[#E57373] text-white py-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors duration-200 ${
                  activeLink === link.href ? "text-[#B71C1C]" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <UserInfo />
          </li>
        </ul>
      )}
    </nav>
  );
}
