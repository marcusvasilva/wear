import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // TODO: remover após substituir por imagens reais da Wear
        protocol: "https",
        hostname: "d1br4h274rc9sc.cloudfront.net",
        pathname: "/content/**",
      },
    ],
  },
};

export default nextConfig;
