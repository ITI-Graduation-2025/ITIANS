import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function LogoClickable({ currentLogoUrl, onUploadSuccess }) {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    setUploading(true);

    try {
      const base64 = await toBase64(selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: base64 }),
      });

      const data = await res.json();

      if (data.url) {
        if (companyId) {
          const companyRef = doc(db, "users", companyId);
          await updateDoc(companyRef, { logo: data.url });
          toast.success("Logo uploaded and saved successfully!");
          if (onUploadSuccess) onUploadSuccess();
        } else {
          toast.error("Company ID not found.");
        }
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (inputRef.current && !uploading) {
      inputRef.current.click();
    }
  };

  return (
    <>
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
          position: "relative",
          width: 80,
          height: 80,
          cursor: uploading ? "not-allowed" : "pointer",
          display: "inline-block",
        }}
        onClick={handleClick}
        title="Click to change logo"
        aria-label="Change company logo"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      >
        <img
          src={currentLogoUrl || "/default-logo.png"}
          alt="Company Logo"
          style={{
            width: 48,
            height: 48,
            objectFit: "contain",
            borderRadius: 6,
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
            display: "block",
          }}
        />

        {!uploading && (
          <button
            type="button"
            onClick={handleClick}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "#1877F2",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              cursor: "pointer",
              userSelect: "none",
            }}
            aria-label="Upload new logo"
            onMouseDown={(e) => e.stopPropagation()} 
          >
            +
          </button>
        )}

        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 6,
              color: "#555",
              fontWeight: "bold",
              fontSize: 12,
              userSelect: "none",
            }}
          >
            Uploading...
          </div>
        )}
      </div>
    </>
  );
}



