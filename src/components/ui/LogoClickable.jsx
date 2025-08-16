import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function LogoClickable({ currentLogoUrl, onUploadSuccess }) {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(currentLogoUrl);
  const inputRef = useRef(null);

  const handleUpload = (file) => {
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const base64 = reader.result;
        const res = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ data: base64 }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.url && companyId) {
          const companyRef = doc(db, "users", companyId);
          await updateDoc(companyRef, { logo: data.url });
          toast.success("Logo uploaded successfully!");
          setLogoPreview(data.url);
          if (onUploadSuccess) onUploadSuccess();
        } else {
          toast.error("Upload failed.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error uploading logo.");
      } finally {
        setUploading(false);
      }
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    handleUpload(file);
  };

  return (
    <div className="relative w-32 h-32">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <img
        src={logoPreview || "/default-logo.png"}
        alt="Company Logo"
        className="w-full h-full object-cover rounded-full border-2 border-blue-600"
      />

      {!uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
        >
          +
        </button>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full font-bold">
          Uploading...
        </div>
      )}
    </div>
  );
}

