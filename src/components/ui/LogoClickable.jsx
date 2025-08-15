





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
        console.log("Uploaded URL:", data.url);

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

    // عرض الصورة فورًا
    setLogoPreview(URL.createObjectURL(file));
    handleUpload(file);
  };

  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid #1877F2",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={logoPreview || "/default-logo.png"}
          alt="Company Logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              fontWeight: "bold",
            }}
          >
            Uploading...
          </div>
        )}
      </div>

      {!uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid white",
            backgroundColor: "#1877F2",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
          aria-label="Upload new logo"
        >
          +
        </button>
      )}
    </div>
  );
}
