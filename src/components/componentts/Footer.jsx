"use client";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#B71C1C] text-[#FFFBF5] pt-16 pb-6 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About</h3>
          <ul className="space-y-3 text-base">
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Team
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <ul className="space-y-3 text-base">
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Mentorship
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Partnerships
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-base">
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-transform duration-200 hover:scale-105 inline-block"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-2xl hover:scale-125 transition-transform duration-200"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transition-transform duration-200"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transition-transform duration-200"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-2xl hover:scale-125 transition-transform duration-200"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#F6E9D7]/30 pt-4 text-center text-sm md:text-base">
        <p>
          &copy; {new Date().getFullYear()} ITI Platform. All rights reserved.
        </p>
        <p className="mt-1">
          <a
            href="#"
            className="underline text-[#F6E9D7] hover:text-white transition-transform duration-200 inline-block hover:scale-105"
          >
            Privacy Policy
          </a>{" "}
          •{" "}
          <a
            href="#"
            className="underline text-[#F6E9D7] hover:text-white transition-transform duration-200 inline-block hover:scale-105"
          >
            Terms & Conditions
          </a>
        </p>
      </div>
    </footer>
  );
}
