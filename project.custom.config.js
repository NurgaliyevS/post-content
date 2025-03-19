import themes from "daisyui/src/theming/themes.js";

export const customConfig = {
  colors: {
    theme: "winter",
    main: themes[`[data-theme=winter"]`],
  },
  // example as pregnantmeal.com without https://
  domainName: "pregnantmeal.com",
  mailgun: {
    subdomain: "mg",
    fromNoReply: `PregnantMeal <noreply@mg.pregnantmeal.com>`,
    fromAdmin: `PregnantMeal <admin@mg.pregnantmeal.com>`,
    supportEmail: "support@pregnantmeal.com",
    forwardRepliesTo: "nurgasab@gmail.com",
  },
  documentTitle: "PregnantMeal - Pregnancy dinner recipes first trimester",
  domainWithHttps: "https://redditscheduler.com",
  seo: {
    keywords:
      "first trimester recipes, 7 day meal plan for pregnant woman, pregnancy dinner recipes first trimester, dinner ideas for first trimester, meal plans for pregnant moms, pregnantmeal, pregnant meal",
    description:
      "PregnantMeal - pregnancy dinner recipes first trimester! Get personalized daily, weekly, and monthly meal plans for a healthy pregnancy.",
    themeColor: "#ffffff",
    applicationName: "pregnantmeal",
    og: {
      title: "PregnantMeal - pregnancy dinner recipes first trimester!",
      url: "https://redditscheduler.com",
      image: "https://redditscheduler.com/company_related/og-image.webp",
      imageAlt:
        "PregnantMeal - pregnancy dinner recipes first trimester! Get personalized daily, weekly, and monthly meal plans for a healthy pregnancy.",
      content: "https://x.com/tech_nurgaliyev",
      twitterSite: "@tech_nurgaliyev",
      twitterImage: "https://redditscheduler.com/company_related/og-image.webp",
    },
  },
  blog: {
    title: "PregnantMeal Blog",
    description:
      "Foods to avoid during pregnancy, first trimester recipes, 7 day meal plan for pregnant woman, pregnancy food aversions, pregnancy dinner recipes first trimester, dinner ideas for first trimester, meal plans for pregnant moms",
    canonical: "https://redditscheduler.com/blog",
    author: {
      name: "Sabyr Nurgaliyev",
      description:
        "I am a software engineer and the husband of a pregnant woman. I wanted to create a platform that helps pregnant women because I know how hard it is to find the right information. My wife is pregnant, and I want to make sure she is eating the right food. I am building PregnantMeal to help moms eat healthy and grow a happy baby.",
    },
  },
};
