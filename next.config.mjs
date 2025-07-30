/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "www.creativefabrica.com",
      },
    ],
    domains: [
      "picsum.photos",
      "firebasestorage.googleapis.com",
      "your-other-domains.com",
    ],
  },
};

export default nextConfig;
