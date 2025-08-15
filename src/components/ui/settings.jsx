"use client";

import { useEffect, useState } from "react";
import { Lock, ArrowLeft, Home, ChevronRight, User, LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function CompanySettings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("password");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("User not logged in");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      // إعادة التحقق من الباسورد الحالي
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // تحديث الباسورد الجديد
      await updatePassword(user, formData.newPassword);
      toast.success("Password updated successfully!");

      // إعادة تعيين الحقول
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast("Changes cancelled");
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900">
      <Toaster />

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-[#b30000]">
          <h1 className="text-xl md:text-2xl font-semibold text-[#b30000]">
            Settings <span className="text-[#203947] text-xl">Dashboard</span>
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-[#333] dark:text-gray-300 transition-colors"
            >
              <User size={16} /> Admin
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow rounded-md py-1 w-40 text-sm">
                <Link
                  href="/ProfileViewCom"
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
                >
                  <User size={14} /> My Profile
                </Link>

                <button className="flex items-center gap-2 w-full px-3 py-2 text-[#b30000] hover:bg-gray-100 hover:text-[#b30000] dark:hover:bg-gray-600 dark:hover:text-white transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="px-8 py-2 flex items-center text-sm text-gray-600 gap-1">
        <Home size={14} /> <ChevronRight size={14} /> Change Password
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <aside className="md:w-52 pr-4 space-y-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-[#b30000]"
          >
            <ArrowLeft /> Back
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`w-full flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-[#f5f5f5] hover:text-[#b30000] dark:hover:bg-gray-700 text-gray-700 dark:text-white ${
              activeTab === "password"
                ? "bg-[#f5f5f5] text-[#b30000] font-semibold dark:bg-gray-700"
                : ""
            }`}
          >
            <Lock size={16} /> Password
          </button>
        </aside>

        {/* Tab Content */}
        <section className="flex-1 pl-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "password" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#333] dark:text-white">Change Password</h2>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200 text-sm font-semibold"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-1.5 border border-[#b30000] text-[#b30000] px-4 py-2 rounded-lg shadow-sm hover:bg-[#b30000] hover:text-white transform hover:scale-[1.01] transition-all duration-200 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}




