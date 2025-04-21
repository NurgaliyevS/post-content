import themes from "daisyui/src/theming/themes.js";

export const customConfig = {
  colors: {
    theme: "winter",
    main: themes[`[data-theme=winter"]`],
  },
  domainName: "post-content.com",
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Post Content <noreply@mg.redditscheduler.com>`,
    fromAdmin: `Post Content <admin@mg.redditscheduler.com>`,
    supportEmail: "nurgasab@gmail.com",
    forwardRepliesTo: "nurgasab@gmail.com",
  },
  documentTitle: "Post Content - Double Reddit Results While You Sleep",
  domainWithHttps: "https://post-content.com",
  seo: {
    keywords:
      "reddit scheduler, reddit automation, reddit marketing, social media automation, reddit posts, schedule reddit posts, reddit traffic, subreddit targeting",
    description:
      "Post Content - Double Reddit Results While You Sleep",
    themeColor: "#ffffff",
    applicationName: "redditscheduler",
    og: {
      title: "Post Content - Double Reddit Results While You Sleep",
      url: "https://post-content.com",
      image: "https://post-content.com/company_related/og-image.jpg",
      imageAlt:
        "Post Content - Automate your Reddit posts and drive traffic to your website. Schedule posts, analyze subreddits, and track performance - all in one platform.",
      content: "https://x.com/tech_nurgaliyev",
      twitterSite: "@tech_nurgaliyev",
      twitterImage: "https://post-content.com/company_related/og-image.jpg",
    },
  },
  blog: {
    title: "Post Content Blog",
    description:
      "Learn about Reddit marketing, automation strategies, content creation, and how to drive traffic from Reddit to your website.",
    canonical: "https://post-content.com/blog",
    author: {
      name: "Sabyr Nurgaliyev",
      description:
        "I am a founder and Reddit marketing expert. I created Post Content to help businesses and content creators automate their Reddit presence and drive meaningful traffic to their websites.",
    },
  },
};
