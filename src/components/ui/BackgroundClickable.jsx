import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function BackgroundClickable({
  currentBackgroundUrl,
  onUploadSuccess,
  width = "100%",
  height = 180,
  children, 
}) {
  const { data: session } = useSession();
  const companyId = session?.user?.id;

  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
          await updateDoc(companyRef, { backgroundUrl: data.url }); 
          toast.success("Background uploaded and saved successfully!");
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

  const backgroundStyle = currentBackgroundUrl
    ? {
        backgroundImage: `url(${currentBackgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { backgroundColor: "#f0f0f0" };

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
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-busy={uploading}
        style={{
          width,
          height,
          borderRadius: 8,
          cursor: uploading ? "not-allowed" : "pointer",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
          position: "relative",
          color: "#fff",
          padding: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "filter 0.3s ease",
          filter: isHovered && !uploading ? "brightness(0.85)" : "none",
          ...backgroundStyle,
        }}
        title="Click to change background"
        aria-label="Change background image"
      >
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              zIndex: 10,
              flexDirection: "column",
              gap: 10,
              color: "#555",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                border: "4px solid #ccc",
                borderTop: "4px solid #555",
                borderRadius: "50%",
                width: 30,
                height: 30,
                animation: "spin 1s linear infinite",
              }}
            ></div>
            Uploading...
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
            `}</style>
          </div>
        )}

        
        {!uploading && (
          <button
            onClick={handleClick}
            style={{
              position: "absolute",
              bottom: 15,
              right: 15,
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "20px",
              padding: "6px 12px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
              transition: "background-color 0.3s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
            }
            type="button"
            aria-label="Change background image"
          >
            Change Background
          </button>
        )}

        <div
          style={{
            width: "100%",
            maxWidth: 960,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          
          {children}

          
          
        </div>
      </div>
    </>
  );
}




