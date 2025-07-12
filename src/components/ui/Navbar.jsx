'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <Image
            src="/iti-logo.png" 
            alt="ITI Logo"
            width={40}
            height={40}
          />
          
        </div>

        
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          <Link href="#" className="text-[#E4002B] font-medium">
            Find Work
          </Link>
          <Link href="#">My Jobs</Link>
          <Link href="#">Messages</Link>
        </nav>

        
        
          <div className="flex items-center gap-2">
            <Image
              src="/profile.jfif" 
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900 leading-none">Jihan Mohamed</p>
              <p className="text-gray-500 text-xs">Jihan Mohamed@gmail.com</p>
            </div>
          </div>
       
      </div>
    </header>
  );
}