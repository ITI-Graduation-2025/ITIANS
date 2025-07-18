"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginForm from "@/components/login-form";
import UserInfo from "../pages/userInfo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "About", href: "/about" },
    { name: "Mentors", href: "/mentor" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-[#B71C1C]/70 backdrop-blur-lg text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="ITIANS Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-wide">ITIANS</span>
        </div>

        {/* Desktop Menu (Center) */}
        <ul className="hidden md:flex justify-center flex-1 gap-8 text-sm items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="hover:text-[#E57373] transition-colors duration-200"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button (Right) */}
        <div className="hidden md:block">
          <UserInfo />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 bg-[#E57373] text-white py-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-[#B71C1C] transition-colors duration-200"
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

      <style jsx>{`
        nav {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
    </nav>
  );
}
