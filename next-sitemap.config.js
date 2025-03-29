const path = require('path');
const fs = require('fs');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://redditscheduler.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/dashboard/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
  sitemapSize: 7000,
  generateIndexSitemap: true,
  outDir: "public",
  // additionalPaths: async (config) => {
  //   const result = [];
  //   const postsDirectory = path.join(process.cwd(), "blog-posts");
  //   const filenames = fs.readdirSync(postsDirectory);

  //   filenames.forEach((filename) => {
  //     result.push({
  //       loc: `/blog/${filename.replace(".md", "")}`,
  //       changefreq: "weekly",
  //       priority: 0.7,
  //     });
  //   });
  // },
};
