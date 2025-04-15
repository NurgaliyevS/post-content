// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.post-content.com',
        pathname: '/**',
      },
    ],
  },
};