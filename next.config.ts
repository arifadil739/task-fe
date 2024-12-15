import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // NEXT_PUBLIC_API_URL: "http://localhost:3000/api/"
  NEXT_PUBLIC_API_URL: "https://task-be-topaz.vercel.app/api/"
};

export default nextConfig;
