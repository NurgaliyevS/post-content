import Head from "next/head";
import { customConfig } from "@/project.custom.config";

export default function SEO() {
  return (
    <Head>
      <title>{customConfig.documentTitle}</title>
      <meta name="description" content={customConfig.seo.description} />
      <meta name="keywords" content={customConfig.seo.keywords} />
      <meta name="theme-color" content={customConfig.seo.themeColor} />
      <meta name="application-name" content={customConfig.seo.applicationName} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={customConfig.seo.og.url} />
      <meta property="og:title" content={customConfig.seo.og.title} />
      <meta property="og:description" content={customConfig.seo.description} />
      <meta property="og:image" content={customConfig.seo.og.image} />
      <meta property="og:image:alt" content={customConfig.seo.og.imageAlt} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={customConfig.seo.og.twitterSite} />
      <meta name="twitter:title" content={customConfig.seo.og.title} />
      <meta name="twitter:description" content={customConfig.seo.description} />
      <meta name="twitter:image" content={customConfig.seo.og.twitterImage} />
      
      <link rel="canonical" href={customConfig.domainWithHttps} />
    </Head>
  );
}