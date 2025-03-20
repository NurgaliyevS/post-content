import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { customConfig } from "@/project.custom.config";

export default function Home() {
  return (
    <>
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
      <div className="min-h-screen bg-base-100">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-xl">RedditScheduler</span>
          </div>
          <div className="flex gap-4">
            <Link href="#features" className="link link-hover">
              Features
            </Link>
            <Link href="#pricing" className="link link-hover">
              Pricing
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="text-center px-4 py-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Schedule Reddit posts that drive
            <br />
            traffic to your website
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Turn Reddit into your traffic machine without the headache
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard →
            </Link>
            <Link href="/demo" className="btn btn-ghost">
              ▶ Demo
            </Link>
          </div>

          {/* Enhanced Results Showcase */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Real Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Result Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-lg">Top Performing Post</h3>
                </div>
                <div className="p-6">
                  <Image
                    src="/redditpost1.webp"
                    alt="Reddit Post Statistics"
                    className="w-full object-contain rounded-lg"
                    width={750}
                    height={570}
                    quality={90}
                  />
                  <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-xl font-bold">455K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                      <p className="text-xl font-bold">94%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="text-xl font-bold">199</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Second Result Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-lg">High Growth Post</h3>
                </div>
                <div className="p-6">
                  <Image
                    src="/redditpost2.webp"
                    alt="Reddit Post Statistics"
                    className="w-full object-contain rounded-lg"
                    width={750}
                    height={570}
                    quality={90}
                  />
                  <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-xl font-bold">305K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                      <p className="text-xl font-bold">93%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="text-xl font-bold">177</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Third Result Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-lg">Consistent Performer</h3>
                </div>
                <div className="p-6">
                  <Image
                    src="/redditpost3.webp"
                    alt="Reddit Post Statistics"
                    className="w-full object-contain rounded-lg"
                    width={750}
                    height={570}
                    quality={90}
                  />
                  <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-xl font-bold">134K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                      <p className="text-xl font-bold">85%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="text-xl font-bold">134</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fourth Result Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-lg">Trending Post</h3>
                </div>
                <div className="p-6">
                  <Image
                    src="/redditpost4.webp"
                    alt="Reddit Post Statistics"
                    className="w-full object-contain rounded-lg"
                    width={750}
                    height={570}
                    quality={90}
                  />
                  <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Total Views</p>
                      <p className="text-xl font-bold">126K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                      <p className="text-xl font-bold">90%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="text-xl font-bold">66</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Impact Summary */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Total Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-3xl font-bold text-primary">1M+</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Engagement</p>
                  <p className="text-3xl font-bold text-primary">90.5%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Engagement</p>
                  <p className="text-3xl font-bold text-primary">1,477</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Alternatives Section */}
        <section className="py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Alternatives are expensive.
          </h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl border border-red-200 bg-red-50">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Marketing Agencies</span>
                <span className="text-red-500">✕</span>
              </div>
              <p className="text-sm text-gray-600">
                Expensive, $50-200 per post, burning through $4500 to $6500 a
                month.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-red-200 bg-red-50">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Doing it yourself</span>
                <span className="text-red-500">✕</span>
              </div>
              <p className="text-sm text-gray-600">
                Hours lost on researching, planning, writing, posting,
                monitoring, re-purposing
              </p>
            </div>
            <div className="p-6 rounded-xl border border-green-200 bg-green-50">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">RedditScheduler</span>
                <span className="text-green-500">✓</span>
              </div>
              <p className="text-sm text-gray-600">
                Automatically scheduling & publishing posts to subreddits, for a
                monthly subscription
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 bg-base-200">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100">
              <div className="card-body">
                <div className="text-primary text-2xl mb-2">📊</div>
                <h3 className="card-title">Scheduling</h3>
                <p className="text-sm text-gray-600">
                  Publish when your target audience is most active
                </p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <div className="text-primary text-2xl mb-2">🎯</div>
                <h3 className="card-title">Cross-Posting</h3>
                <p className="text-sm text-gray-600">
                  Post to multiple subreddits with one click
                </p>
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <div className="text-primary text-2xl mb-2">📈</div>
                <h3 className="card-title">Hook Generator</h3>
                <p className="text-sm text-gray-600">
                  Viral templates for your posts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="card bg-base-100 border">
              <div className="card-body">
                <h3 className="card-title">Starter</h3>
                <div className="text-3xl font-bold mb-4">
                  $9<span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span>✓</span> 10 scheduled posts per month
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Viral hooks
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Unlimited subreddits
                  </li>
                </ul>
                <button className="btn btn-outline mt-4 w-full">Buy Now</button>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="card bg-base-100 border border-primary">
              <div className="card-body relative">
                <h3 className="card-title">Growth</h3>
                <div className="text-3xl font-bold mb-4">
                  $18<span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span>✓</span> 50 scheduled posts per month
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Viral hooks
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Unlimited subreddits
                  </li>
                </ul>
                <button className="btn btn-primary mt-4 w-full">Buy Now</button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="card bg-base-100 border">
              <div className="card-body">
                <h3 className="card-title">Scale</h3>
                <div className="text-3xl font-bold mb-4">
                  $27<span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span>✓</span> 150 scheduled posts per month
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Viral hooks
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> Unlimited subreddits
                  </li>
                </ul>
                <button className="btn btn-outline mt-4 w-full">
                  Buy Plan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer p-10 bg-base-200 text-base-content">
          <div>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <p>
              RedditScheduler
              <br />
              Automating your Reddit presence
            </p>
          </div>
          <div>
            <span className="footer-title">Product</span>
            <Link href="#features" className="link link-hover">
              Features
            </Link>
            <Link href="#pricing" className="link link-hover">
              Pricing
            </Link>
          </div>
          <div>
            <span className="footer-title">Company</span>
            <Link href="/about" className="link link-hover">
              About
            </Link>
          </div>
          <div>
            <span className="footer-title">Legal</span>
            <Link href="/privacy-policy" className="link link-hover">
              Privacy Policy
            </Link>
            <Link href="/terms" className="link link-hover">
              Terms of Service
            </Link>
          </div>
        </footer>
        <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
          <div className="text-sm">
            © 2025 RedditScheduler. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}