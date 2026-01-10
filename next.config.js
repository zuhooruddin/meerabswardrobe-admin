// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig



module.exports = {
  // Set basePath if the app is deployed at /admin/ path
  // Uncomment the line below if your app is served at https://chitralhive.com/admin/
  // basePath: '/admin',

  // ESLint configuration
  eslint: {
    // Set to true to suppress ESLint messages during builds
    // WARNING: This will hide real ESLint errors, use with caution
    ignoreDuringBuilds: true, // Set to false to see ESLint errors during builds
  },
  
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  images: {
    domains: ["https://chitralhive.com/api/"],
  },
};

