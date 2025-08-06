"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Bell,
  UploadCloud,
  Linkedin,
  ArrowLeft,
  LogOut,
  Home,
  ChevronRight,
  User,
  Layers,
  Code,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function CompanySettings() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [activeTab, setActiveTab] = useState("password");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) fetchData();
  }, [companyId]);

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, "users", companyId);
    const docSnap = await getDoc(docRef);
    let data;
    if (docSnap.exists()) {
      data = docSnap.data();
      data = {
        ...data,
          companyName: data.companyName || data.name || "My Company",
        coreServices: Array.isArray(data.services)
          ? data.services.join(", ")
          : data.coreServices || "",
        technologies: Array.isArray(data.technologies)
          ? data.technologies.join(", ")
          : data.technologies || "",
      };
    } else {
      data = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        notifications: true,
        language: "English",
        currency: "USD",
        theme: "Light",
        logo: null,
        linkedin: "",
        facebook: "",
        companyName: "My Company",
        coreServices: "",
        technologies: "",
        companyName: "My Company",
      };
    }
    setFormData(data);
    setInitialData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!formData) return;
    if (formData.theme === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [formData?.theme]);

  const toggleTheme = () => {
    setFormData((prev) => ({
      ...prev,
      theme: prev.theme === "Light" ? "Dark" : "Light",
    }));
  };

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData };

      dataToSave.services = dataToSave.coreServices
        ? dataToSave.coreServices
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
        : [];

      dataToSave.technologies = dataToSave.technologies
        ? dataToSave.technologies
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
        : [];

      delete dataToSave.coreServices;

      if (dataToSave.logo instanceof File) {
        dataToSave.logo = null;
      }

      await setDoc(doc(db, "users", companyId), dataToSave);
      toast.success("Settings saved successfully!");
      setInitialData(dataToSave);
    } catch (err) {
      toast.error("Error saving settings");
      console.error(err);
    }
  };

  const handleCancelTab = () => {
    setFormData((prev) => ({
      ...prev,
      ...(activeTab === "password" && {
        currentPassword: initialData.currentPassword,
        newPassword: initialData.newPassword,
        confirmPassword: initialData.confirmPassword,
      }),
      ...(activeTab === "notifications" && {
        notifications: initialData.notifications,
      }),
      ...(activeTab === "logo" && {
        logo: initialData.logo,
      }),
      ...(activeTab === "social" && {
        linkedin: initialData.linkedin,
        facebook: initialData.facebook,
      }),
      ...(activeTab === "coreServices" && {
        coreServices: initialData.coreServices,
      }),
      ...(activeTab === "technologies" && {
        technologies: initialData.technologies,
      }),
    }));
    toast("Changes cancelled");
  };

  // Skeleton Loader أثناء التحميل
  if (loading || !formData) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900">
        <div className="animate-pulse">
          {/* Navbar Skeleton */}
          <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </nav>

          {/* Breadcrumb Skeleton */}
          <div className="px-8 py-3 flex items-center gap-2">
            <div className="h-3 w-3 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Content Skeleton */}
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-4">
            {/* Sidebar Skeleton */}
            <aside className="md:w-52 space-y-3 pr-4 border-r border-gray-200 dark:border-gray-700">
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </aside>

            {/* Tab Content Skeleton */}
            <section className="flex-1 space-y-5">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>

              <div className="flex gap-3 pt-3">
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900">
      <Toaster />

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-[#b30000]">
          <img
            src={
              formData.logo
                ? URL.createObjectURL(formData.logo)
                : "/default-logo.png"
            }
            alt="Company Logo"
            className="w-9 h-9 rounded-full object-cover border border-[#b30000]/30"
          />
          <h1 className="text-xl md:text-2xl font-semibold text-[#b30000]">
  {formData?.companyName || "My Company"}{' '}
  <span className="text-[#203947] text-xl">Dashboard</span>
</h1>

        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-sm rounded bg-[#f5f5f5] text-[#333] hover:bg-[#eaeaea] dark:bg-gray-700 dark:text-white"
          >
            {formData.theme === "Light" ? "🌞 Light" : "🌙 Dark"}
          </button>

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
        <User size={14} />
        My Profile
      </Link>

      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-[#b30000] hover:bg-gray-100 hover:text-[#b30000] dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
      >
        <LogOut size={14} />
        Logout
      </button>
    </div>
  )}
</div>

        </div>
      </nav>

      <div className="px-8 py-2 flex items-center text-sm text-gray-600 gap-1">
        <Home size={14} /> <ChevronRight size={14} /> Settings
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8 flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <aside className="md:w-52 border-r border-gray-200 dark:border-gray-700 pr-4 space-y-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-[#b30000]"
          >
            <ArrowLeft /> Back
          </button>

          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`${tabBtn} ${
                activeTab === id
                  ? "bg-[#f5f5f5] text-[#b30000] font-semibold dark:bg-gray-700"
                  : ""
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <section className="flex-1 pl-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderTabContent({ ...formData, activeTab }, handleChange, toggleTheme)}

            <div className="flex gap-3 pt-3">
              {/* زر الحفظ */}
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#b30000] to-[#8B0000] text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200 text-sm font-semibold"
              >
                Save Changes
              </button>

              {/* زر الإلغاء */}
              <button
                type="button"
                onClick={handleCancelTab}
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

const tabs = [
  { id: "password", label: "Password", Icon: Lock },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "logo", label: "Logo", Icon: UploadCloud },
  { id: "social", label: "Social Media", Icon: Linkedin },
  { id: "coreServices", label: "Core Services", Icon: Layers },
  { id: "technologies", label: "Technologies We Use", Icon: Code },
];

const tabBtn =
  "w-full flex items-center gap-2 text-left px-2 py-2 rounded hover:bg-[#f5f5f5] hover:text-[#b30000] dark:hover:bg-gray-700 text-gray-700 dark:text-white";

const input =
  "w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b30000]";

function renderTabContent(formData, handleChange) {
  switch (formData.activeTab || "password") {
    case "password":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#333] dark:text-white">Change Password</h2>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            className={input}
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            className={input}
            value={formData.newPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            className={input}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      );
    case "notifications":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#333] dark:text-white">Notifications</h2>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
            />
            Receive email notifications
          </label>
        </div>
      );
    case "logo":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#333] dark:text-white">Company Logo</h2>
          <input type="file" name="logo" onChange={handleChange} />
        </div>
      );
    case "social":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#333] dark:text-white">Social Media</h2>
          <input
            type="url"
            name="linkedin"
            placeholder="LinkedIn URL"
            className={input}
            value={formData.linkedin}
            onChange={handleChange}
          />
          <input
            type="url"
            name="facebook"
            placeholder="Facebook URL"
            className={input}
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>
      );
    case "coreServices":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[#333] dark:text-white">
            <Layers className="text-[#b30000]" /> Core Services
          </h2>
          <textarea
            name="coreServices"
            value={formData.coreServices}
            onChange={handleChange}
            placeholder="Web Design, Mobile App Development, SEO"
            className={input}
            rows={6}
          />
        </div>
      );
    case "technologies":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[#333] dark:text-white">
            <Code className="text-[#b30000]" /> Technologies We Use
          </h2>
          <textarea
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="List the technologies you use..."
            className={input}
            rows={6}
          />
        </div>
      );
    default:
      return null;
  }
}


