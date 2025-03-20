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
        {/* Basic meta tags */}
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#fafafa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-title"
          content={customConfig.seo.applicationName}
        />
        <meta
          name="application-name"
          content={customConfig.seo.applicationName}
        />

        <link rel="icon" href="/logo.svg" />
        
        {/* Favicon links */}
        {/* <link
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
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
