// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dl79knb0g/**",
      },
    ],
  },

 async rewrites() {
  return [
    {
      source: "/backend/:path*",
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
    },
  ];
},
};

export default nextConfig;