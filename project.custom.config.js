import themes from "daisyui/src/theming/themes.js";

export const customConfig = {
  colors: {
    theme: "winter",
    main: themes[`[data-theme=winter"]`],
  },
  domainName: "redditscheduler.com",
  mailgun: {
    subdomain: "mg",
    fromNoReply: `RedditScheduler <noreply@mg.redditscheduler.com>`,
    fromAdmin: `RedditScheduler <admin@mg.redditscheduler.com>`,
    supportEmail: "support@redditscheduler.com",
    forwardRepliesTo: "nurgasab@gmail.com",
  },
  documentTitle: "RedditScheduler - Schedule Reddit posts that drive traffic to your website",
  domainWithHttps: "https://redditscheduler.com",
  seo: {
    keywords:
      "reddit scheduler, reddit automation, reddit marketing, social media automation, reddit posts, schedule reddit posts, reddit traffic, subreddit targeting",
    description:
      "RedditScheduler - Schedule Reddit posts that drive traffic to your website",
    themeColor: "#ffffff",
    applicationName: "redditscheduler",
    og: {
      title: "RedditScheduler - Schedule Reddit posts that drive traffic to your website",
      url: "https://redditscheduler.com",
      image: "https://redditscheduler.com/company_related/og-image.webp",
      imageAlt:
        "RedditScheduler - Automate your Reddit posts and drive traffic to your website. Schedule posts, analyze subreddits, and track performance - all in one platform.",
      content: "https://x.com/tech_nurgaliyev",
      twitterSite: "@tech_nurgaliyev",
      twitterImage: "https://redditscheduler.com/company_related/og-image.webp",
    },
  },
  blog: {
    title: "RedditScheduler Blog",
    description:
      "Learn about Reddit marketing, automation strategies, content creation, and how to drive traffic from Reddit to your website.",
    canonical: "https://redditscheduler.com/blog",
    author: {
      name: "Sabyr Nurgaliyev",
      description:
        "I am a founder and Reddit marketing expert. I created RedditScheduler to help businesses and content creators automate their Reddit presence and drive meaningful traffic to their websites.",
    },
  },
};
