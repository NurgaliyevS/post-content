import Head from 'next/head'
import Layout from '../components/Layout'

export default function Privacy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - Post Content</title>
        <meta name="description" content="Privacy Policy for Post Content" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when using Post Content:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Reddit account information (username, access tokens)</li>
              <li>Post scheduling data</li>
              <li>Subreddit information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Provide and maintain our service</li>
              <li>Schedule and post content on your behalf</li>
              <li>Improve our service</li>
              <li>Communicate with you about our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at nurgasab@gmail.com</p>
          </section>
        </div>
      </div>
    </Layout>
  )
} 