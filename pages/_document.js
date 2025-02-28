import { customConfig } from "@/project.custom.config";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      data-theme={customConfig.colors.theme}
      className="scroll-smooth"
    >
      <Head>
        {/* Removing global keywords to allow page-specific keywords */}
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#fafafa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* example as PregnantMeal without .com */}
        <meta
          name="apple-mobile-web-app-title"
          content={customConfig.seo.applicationName}
        />
        {/* example as PregnantMeal without .com */}
        <meta
          name="application-name"
          content={customConfig.seo.applicationName}
        />
        <meta
          property="og:title"
          // example as PregnantMeal - Monitor your website, and server
          content={customConfig.seo.og.title}
          key="og:title"
        />
        <meta
          property="og:description"
          // example as PregnantMeal - Monitor your website, and server
          content={customConfig.seo.description}
          key="og:description"
        />
        {/* example as https://pregnantmeal.com/ */}
        <meta property="og:url" content={customConfig.domainWithHttps} key="og:url" />
        <meta property="og:type" content="website" key="og:type" />
        {/* example as PregnantMeal */}
        <meta
          property="og:site_name"
          content={customConfig.seo.applicationName}
        />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:image"
          // add to public og image and it will be as https://pregnantmeal.com/og-image.png
          content={customConfig.seo.og.image}
          key="og:image"
        />
        <meta property="og:image:alt" content={customConfig.seo.og.imageAlt} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="article:author"
          // example as https://x.com/tech_nurgaliyev
          content={customConfig.seo.og.articleAuthor}
        />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta name="twitter:site" content={customConfig.seo.og.twitterSite} key="twitter:site" />
        <meta name="twitter:creator" content="@tech_nurgaliyev" />
        <meta
          name="twitter:title"
          // PregnantMeal - Monitor your website, and server
          content={customConfig.seo.og.title}
          key="twitter:title"
        />
        <meta
          name="twitter:description"
          // example as Start monitoring in 30 seconds. Get notified by email, and SMS. Monitor your website, and server.
          content={customConfig.seo.description}
          key="twitter:description"
        />
        {/* example as https://pregnantmeal.com/twitter.png */}
        <meta name="twitter:image" content={customConfig.seo.og.twitterImage} key="twitter:image" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/company_related/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/company_related/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href="/company_related/favicon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/company_related/favicon-192x192.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/company_related/apple-icon-57x57.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/company_related/apple-icon-60x60.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
