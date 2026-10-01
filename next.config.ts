import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: "/raviadminmishra", permanent: false },
    ];
  },
  serverExternalPackages: ["sharp", "ffmpeg-static"],
  experimental: {
    proxyClientMaxBodySize: "80mb",
    serverActions: {
      bodySizeLimit: "80mb",
    },
  },
};

export default nextConfig;
