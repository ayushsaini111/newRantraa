
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dl79knb0g/**",
      },
    ],
  },

  async rewrites() {
    const backendUrl =
      process.env.NODE_ENV === "production"
        ? "https://astro-nine-beige.vercel.app"
        : "http://localhost:3001";

    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
