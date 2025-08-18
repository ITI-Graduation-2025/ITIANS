"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import toast, { Toaster } from "react-hot-toast";
import { Phone } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";

export default function EditableProfileViewCom() {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing states
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");

  const [editingServices, setEditingServices] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  const [editingTech, setEditingTech] = useState(false);
  const [techList, setTechList] = useState([]);

  const [editingContact, setEditingContact] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    website: "",
    email: "",
    linkedin: "",
    facebook: "",
    phone: "",
  });

  // Fetch company data
  const fetchCompany = async () => {
    if (!companyId) return;
    try {
      const companyRef = doc(db, "users", companyId);
      const companySnap = await getDoc(companyRef);
      const companyData = companySnap.exists() ? companySnap.data() : {};
      setCompany(companyData);

      // Initialize editing states
      setAboutText(companyData.description || "");
      setServicesList(companyData.services || []);
      setTechList(companyData.technologies || []);
      setContactInfo({
        website: companyData.website || "",
        email: companyData.email || "",
        linkedin: companyData.linkedin || "",
        facebook: companyData.facebook || "",
        phone: companyData.phone || "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load company data.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  // Save handlers
  const saveAbout = async () => {
    try {
      await updateDoc(doc(db, "users", companyId), { description: aboutText });
      setEditingAbout(false);
      fetchCompany();
      toast.success("About section updated!");
    } catch {
      toast.error("Failed to update About section.");
    }
  };

  const saveServices = async () => {
    try {
      await updateDoc(doc(db, "users", companyId), { services: servicesList });
      setEditingServices(false);
      fetchCompany();
      toast.success("Core services updated!");
    } catch {
      toast.error("Failed to update Core services.");
    }
  };

  const saveTech = async () => {
    try {
      await updateDoc(doc(db, "users", companyId), { technologies: techList });
      setEditingTech(false);
      fetchCompany();
      toast.success("Technologies updated!");
    } catch {
      toast.error("Failed to update Technologies.");
    }
  };

  const saveContact = async () => {
    try {
      await updateDoc(doc(db, "users", companyId), contactInfo);
      setEditingContact(false);
      fetchCompany();
      toast.success("Contact info updated!");
    } catch {
      toast.error("Failed to update Contact Info.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-4">
      <Toaster position="top-right" />

      {/* About Section */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#203947]">About {company.name}</h2>
          <button
            onClick={() => setEditingAbout(!editingAbout)}
            className="text-sm text-[#b30000] hover:underline"
          >
            {editingAbout ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingAbout ? (
          <div className="space-y-2">
            <textarea
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#b30000]"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={saveAbout}
                className="px-4 py-1 bg-[#b30000] text-white rounded hover:bg-[#8B0000]"
              >
                Save
              </button>
              <button
                onClick={() => setEditingAbout(false)}
                className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#333]">{aboutText || "No description provided."}</p>
        )}
      </div>

      {/* Core Services */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#203947]">Core Services</h2>
          <button
            onClick={() => setEditingServices(!editingServices)}
            className="text-sm text-[#b30000] hover:underline"
          >
            {editingServices ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingServices ? (
          <div className="space-y-2">
            {servicesList.map((service, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 border p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={service}
                  onChange={(e) => {
                    const newList = [...servicesList];
                    newList[idx] = e.target.value;
                    setServicesList(newList);
                  }}
                />
                <button
                  onClick={() =>
                    setServicesList(servicesList.filter((_, i) => i !== idx))
                  }
                  className="text-red-500 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={() => setServicesList([...servicesList, ""])}
                className="px-3 py-1 bg-[#b30000] text-white rounded hover:bg-[#8B0000]"
              >
                Add Service
              </button>
              <button
                onClick={saveServices}
                className="px-3 py-1 bg-[#203947] text-white rounded hover:bg-[#111]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <ul className="text-sm mt-1 space-y-1 columns-2 text-[#333]">
            {servicesList.length > 0
              ? servicesList.map((s, i) => <li key={i}>{s}</li>)
              : <p className="text-gray-500">No core services listed.</p>}
          </ul>
        )}
      </div>

      {/* Technologies */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#203947]">Technologies We Use</h2>
          <button
            onClick={() => setEditingTech(!editingTech)}
            className="text-sm text-[#b30000] hover:underline"
          >
            {editingTech ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingTech ? (
          <div className="flex flex-wrap gap-2">
            {techList.map((tech, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                <input
                  type="text"
                  className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={tech}
                  onChange={(e) => {
                    const newList = [...techList];
                    newList[idx] = e.target.value;
                    setTechList(newList);
                  }}
                />
                <button
                  onClick={() => setTechList(techList.filter((_, i) => i !== idx))}
                  className="text-red-500 font-semibold"
                >
                  x
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setTechList([...techList, ""])}
                className="px-3 py-1 bg-[#b30000] text-white rounded hover:bg-[#8B0000]"
              >
                Add Tech
              </button>
              <button
                onClick={saveTech}
                className="px-3 py-1 bg-[#203947] text-white rounded hover:bg-[#111]"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-sm text-[#333]">
            {techList.length > 0
              ? techList.map((tech, i) => (
                  <div key={i} className="px-2 py-1 bg-gray-100 rounded text-center">{tech}</div>
                ))
              : <p className="text-gray-500">No technologies listed.</p>}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#203947]">Contact Information</h2>
          <button
            onClick={() => setEditingContact(!editingContact)}
            className="text-sm text-[#b30000] hover:underline"
          >
            {editingContact ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingContact ? (
          <div className="space-y-3">
            {Object.entries(contactInfo).map(([field, value]) => (
              <div key={field} className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="w-24 font-medium text-gray-700 capitalize">{field}:</label>
                <input
                  type="text"
                  className="flex-1 border p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                  value={value}
                  onChange={(e) => setContactInfo({ ...contactInfo, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={saveContact}
                className="px-4 py-1 bg-[#b30000] text-white rounded hover:bg-[#8B0000]"
              >
                Save
              </button>
              <button
                onClick={() => setEditingContact(false)}
                className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm mt-2 space-y-2 text-[#333]">
            {contactInfo.website && <p><FaGlobe className="inline w-4 h-4 mr-1 text-[#b30000]" /> <a href={contactInfo.website} target="_blank">{contactInfo.website}</a></p>}
            {contactInfo.email && <p><FaEnvelope className="inline w-4 h-4 mr-1 text-[#b30000]" /> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>}
            {contactInfo.linkedin && <p><FaLinkedin className="inline w-4 h-4 mr-1 text-[#b30000]" /> <a href={contactInfo.linkedin} target="_blank">{contactInfo.linkedin}</a></p>}
            {contactInfo.facebook && <p><FaFacebook className="inline w-4 h-4 mr-1 text-[#b30000]" /> <a href={contactInfo.facebook} target="_blank">{contactInfo.facebook}</a></p>}
            {contactInfo.phone && <p><Phone className="inline w-4 h-4 mr-1 text-[#b30000]" /> {contactInfo.phone}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

