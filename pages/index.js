import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        
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
            <Link href="/product" className="link link-hover">
              Product
            </Link>
            <Link href="/pricing" className="link link-hover">
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

          {/* Example Posts Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-16 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="relative aspect-[3/4] rounded-xl bg-gray-200 overflow-hidden transform hover:scale-105 transition-transform"
              >
                <Image
                  src={`/reddit-post-${i}.svg`}
                  alt={`Reddit Post ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
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
        <section className="py-16 px-4 bg-base-200">
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
        <section className="py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Change your plan
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
            <Link href="/features" className="link link-hover">
              Features
            </Link>
            <Link href="/pricing" className="link link-hover">
              Pricing
            </Link>
          </div>
          <div>
            <span className="footer-title">Company</span>
            <Link href="/about" className="link link-hover">
              About
            </Link>
            <Link href="/contact" className="link link-hover">
              Contact
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
            © 2024 RedditScheduler. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
