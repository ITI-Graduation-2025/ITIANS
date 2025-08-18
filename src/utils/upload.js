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

export const uploadDocument = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid document file (PDF, DOC, or DOCX)');
  }

  // Validate file size (max 10MB for documents)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Document size should be less than 10MB');
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "next-upload-preset");
  formData.append("resource_type", "raw");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnhbcvgfb/raw/upload",
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
    console.error("Document upload error:", error);
    throw error;
  }
};
