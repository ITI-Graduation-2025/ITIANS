"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#e5e5e5] text-[var(--primary)] p-6">
      {/* Bottom Bar */}
      <div className="border-t border-transparent pt-4 text-center text-base font-semibold ">
        <p>
          &copy; {new Date().getFullYear()} ITI Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
