import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "res.cloudinary.com",
      },
    ],
  },

  serverExternalPackages: [
    "@sparticuz/chromium-min",
    "puppeteer-core",
  ],
};

export default nextConfig;