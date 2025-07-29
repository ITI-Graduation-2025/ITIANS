"use client";

import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

export default function ApplyModal({ jobTitle, onClose }) {
  const [cvFile, setCvFile] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#B71C1C]">
          Apply for {jobTitle}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Application submitted!");
            onClose();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full border rounded px-3 py-2"
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-[#333]">
              Upload Your CV
            </label>
            <label
              className="flex items-center gap-3 cursor-pointer border border-dashed border-[#B71C1C] rounded p-2 hover:bg-[#f9f9f9]"
              title="Accepted formats: PDF, DOC, DOCX"
            >
              <FaFilePdf className="text-[#B71C1C] text-2xl" />
              <span className="text-sm text-gray-700">
                {cvFile ? cvFile.name : "Choose your CV file"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#B71C1C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#B71C1C] text-white px-4 py-2 rounded hover:bg-[#8B0000] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
