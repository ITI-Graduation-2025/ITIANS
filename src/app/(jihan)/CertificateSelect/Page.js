"use client";

import React, { useState } from "react";

export default function AddCertificatePage() {
  const [certificateName, setCertificateName] = useState("");
  const [year, setYear] = useState("");
  const [imageFile, setImageFile] = useState(null);

  return (
    <main className="flex justify-center py-10 bg-[#f5f5f5] px-2">
      <div className="bg-white p-4 rounded-lg shadow w-full max-w-5xl border border-gray-200">
        <h1 className="text-lg font-semibold text-[#b01e2f] mb-3">Add Certification</h1>

        <form className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2">
            <label className="text-xs text-gray-800">Certificate Name</label>
            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="e.g., Certified Public Accountant"
              className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-[#b01e2f] focus:border-[#b01e2f]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-800">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2024"
              className="w-full border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-[#b01e2f] focus:border-[#b01e2f]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-800">Certificate Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#b01e2f] file:text-white hover:file:bg-red-700"
              required
            />
          </div>
        </form>
      </div>
    </main>
  );
}














