/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["mongodb", "nodemailer", "bcryptjs"],
  },
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.cache = false;
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        dns: false,
        timers: false,
        os: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        kerberos: false,
        "@mongodb-js/zstd": false,
        "@aws-sdk/credential-providers": false,
        "gcp-metadata": false,
        snappy: false,
        socks: false,
        aws4: false,
        "mongodb-client-encryption": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
