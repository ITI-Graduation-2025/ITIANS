export const upload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (imageTypes.includes(file.type)) {
    return await uploadImage(e);
  } else if (docTypes.includes(file.type)) {
    return await uploadDocument(e);
  } else {
    throw new Error(
      "Unsupported file type. Please select an image or document.",
    );
  }
};

export const uploadImage = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "next-upload-preset");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhs4vhvyj/image/upload",
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
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please select a valid document file (PDF, DOC, or DOCX)");
  }

  // Validate file size (max 10MB for documents)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Document size should be less than 10MB");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "next-upload-preset");

  // Use 'auto' for documents to let Cloudinary handle the type
  formData.append("resource_type", "auto");

  // Add flags for better compatibility
  formData.append("flags", "attachment");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhs4vhvyj/auto/upload",
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

// Utility function to clean Cloudinary URLs for better download compatibility
export const getCleanCloudinaryUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  try {
    let cleanUrl = url;

    // For documents, ensure we're using the right resource type
    // But keep the version timestamp as it's required for Cloudinary
    if (cleanUrl.includes("/raw/upload/")) {
      cleanUrl = cleanUrl.replace("/raw/upload/", "/auto/upload/");
    }

    return cleanUrl;
  } catch (error) {
    console.error("Error cleaning Cloudinary URL:", error);
    return url;
  }
};

// Function to convert raw upload URLs to auto upload URLs for better download compatibility
export const convertRawToAutoUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  try {
    // Convert /raw/upload/ to /auto/upload/ for better compatibility
    if (url.includes("/raw/upload/")) {
      return url.replace("/raw/upload/", "/auto/upload/");
    }

    return url;
  } catch (error) {
    console.error("Error converting raw to auto URL:", error);
    return url;
  }
};

// Function to convert image upload URLs to auto upload URLs for PDF files
export const convertImageToAutoUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  try {
    // Convert /image/upload/ to /auto/upload/ for PDF files
    if (url.includes("/image/upload/") && url.toLowerCase().includes(".pdf")) {
      return url.replace("/image/upload/", "/auto/upload/");
    }

    return url;
  } catch (error) {
    console.error("Error converting image to auto URL:", error);
    return url;
  }
};
