"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Bell,
  Globe,
  UploadCloud,
  Linkedin,
  ArrowLeft,
  LogOut,
  Home,
  ChevronRight,
  User,
  Layers,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
      };
    }
    setFormData(data);
    setInitialData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!companyId) return;
    fetchData();
  }, [companyId]);

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
      ...(activeTab === "language" && {
        language: initialData.language,
        currency: initialData.currency,
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

  if (loading || !formData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster />
      <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center relative">
        <div className="flex items-center gap-2 text-xl font-bold text-red-600">
          <img
            src={
              formData.logo
                ? URL.createObjectURL(formData.logo)
                : "/default-logo.png"
            }
            alt="Company Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          Dashboard -{" "}
          <span className="text-gray-700 dark:text-gray-300">
            {formData.companyName}
          </span>
        </div>

        <div className="flex gap-4 items-center relative">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {formData.theme === "Light" ? "🌞 Light" : "🌙 Dark"}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
            >
              <User size={16} /> Admin
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow rounded py-1 w-32 text-sm">
                <button className="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                  Profile
                </button>
                <button className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex gap-1 items-center">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="px-8 py-2 flex items-center text-sm text-gray-600 gap-1">
        <Home size={14} /> <ChevronRight size={14} /> Settings
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-8 flex flex-col md:flex-row gap-4">
        <aside className="md:w-48 border-r pr-4 space-y-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-red-600"
          >
            <ArrowLeft /> Back
          </button>

          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`${tabBtn} ${
                activeTab === id ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>

        <section className="flex-1 pl-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderTabContent({ ...formData, activeTab }, handleChange, toggleTheme)}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelTab}
                className="border border-red-600 text-red-600 px-6 py-3 rounded hover:bg-red-50"
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
  { id: "language", label: "Language & Currency", Icon: Globe },
  { id: "logo", label: "Logo", Icon: UploadCloud },
  { id: "social", label: "Social Media", Icon: Linkedin },
  { id: "coreServices", label: "Core Services", Icon: Layers },
  { id: "technologies", label: "Technologies We Use", Icon: Code },
];

const tabBtn =
  "w-full flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white";

const input =
  "w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600";

function renderTabContent(formData, handleChange, toggleTheme) {
  switch (formData.activeTab || "password") {
    case "password":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
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
          <h2 className="text-xl font-semibold">Notifications</h2>
          <label className="flex items-center gap-2">
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
    case "language":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Language & Currency</h2>
          <select
            name="language"
            className={input}
            value={formData.language}
            onChange={handleChange}
          >
            <option>English</option>
            <option>Arabic</option>
            <option>French</option>
          </select>
          <select
            name="currency"
            className={input}
            value={formData.currency}
            onChange={handleChange}
          >
            <option>USD</option>
            <option>EGP</option>
            <option>EUR</option>
          </select>
        </div>
      );
    case "logo":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Company Logo</h2>
          <input type="file" name="logo" onChange={handleChange} />
        </div>
      );
    case "social":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Media</h2>
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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="text-red-500" /> Core Services
          </h2>
          <textarea
  name="coreServices"
  value={formData.coreServices}
  onChange={handleChange}
  placeholder=" Web Design, Mobile App Development, SEO"
  className={input}
  rows={6}
/>

        </div>
      );
    case "technologies":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code className="text-red-500" /> Technologies We Use
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

