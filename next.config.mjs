/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.104'],
  images: {
    domains: ['res.cloudinary.com'],
  },
}

export default nextConfig
