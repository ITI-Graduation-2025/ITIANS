export const upload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "next-upload-preset");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dnhbcvgfb/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();
  return data.secure_url;
};
