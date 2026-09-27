/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Hosts allowed for next/image when factory or product photography is
    // served remotely (company domain, Vercel Blob storage).
    remotePatterns: [
      { protocol: "https", hostname: "giantstarbd.com" },
      { protocol: "https", hostname: "**.giantstarbd.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
