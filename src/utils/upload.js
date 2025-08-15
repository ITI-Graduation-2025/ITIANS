export const upload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "next-upload-preset");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnhbcvgfb/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (data.error) {
      throw new Error(`Cloudinary error: ${data.error.message}`);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
