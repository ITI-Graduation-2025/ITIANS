"use client";

import React from "react";
import { User, LogOut, Settings } from "lucide-react";

export default function ProfileDropdown({ onAction, onClose }) {
  const handleAction = (action) => {
    if (onAction) onAction(action);
    if (onClose) onClose(); 
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 text-sm">
     
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <img
          src="/your-avatar.png"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">Jihan Mohamed Abdel…</p>
          <p className="text-gray-500 text-xs">Freelancer</p>
        </div>
      </div>


     
      <button
        onClick={() => handleAction("profile")}
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
      >
        <User className="w-4 h-4" /> Your Profile
      </button>

      <button
        onClick={() => handleAction("settings")}
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
      >
        <Settings className="w-4 h-4" /> Account Settings
      </button>

      <button
        onClick={() => handleAction("logout")}
        className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}




