/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zocqhzuyrkomexuirebq.supabase.co', // <--- Your Supabase URL
        port: '',
        pathname: '/storage/v1/object/public/**', // Restrict to public storage only
      },
      // You might also need Unsplash if you are using placeholder images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
