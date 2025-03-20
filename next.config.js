// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.redditscheduler.com',
        pathname: '/**',
      },
    ],
  },
};