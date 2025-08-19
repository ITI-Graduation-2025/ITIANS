"use client";

import { useEffect, useState } from "react";
import { 
  Lock, ArrowLeft, Home, ChevronRight, User, LogOut, Settings, ChevronDown 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function CompanySettings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("password");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Loading...");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyId = session?.user?.id; 
        if (!companyId) return;

        const docRef = doc(db, "users", companyId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setCompanyName(snap.data().name || "Company");
        } else {
          setCompanyName("Company");
        }
      } catch (err) {
        console.error(err);
        setCompanyName("Company");
      }
    };

    fetchCompanyData();
  }, [session]);

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
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, formData.newPassword);
      toast.success("Password updated successfully!");

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
        {/* العنوان أو القسم الأيسر */}
        <div className="flex items-center gap-2 text-xl font-bold text-[#b30000]">
          <h1 className="text-xl md:text-2xl font-semibold text-[#003366] flex items-center gap-2">
            <Settings size={24} />
            Settings
          </h1>
        </div>

        {/* القسم الأيمن */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 bg-transparent border-none cursor-pointer focus:outline-none"
                  type="button"
                >
                  <User size={18} className="text-gray-600" />
                  <span className="text-gray-800 font-medium">
                    {companyName}
                  </span>
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48" align="end">
                <Link href="/dashboardCompany">
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <User size={16} />
                    My Dashboard
                  </DropdownMenuItem>
                </Link>

                <Link href="/ProfileViewCom">
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={16} />
                    My Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="cursor-pointer text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <h2 className="text-xl font-semibold text-[#333] dark:text-white">
                  Change Password
                </h2>
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





