import Head from 'next/head'
import Layout from '../components/Layout'

export default function Terms() {
  return (
    <Layout>
      <Head>
        <title>Terms of Service - Post Content</title>
        <meta name="description" content="Terms of Service for Post Content" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg">
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Post Content, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily use Post Content for personal, non-commercial use only. This license does not include:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose</li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Reddit API Compliance</h2>
            <p>Users must comply with Reddit's API Terms of Service and Content Policy. We are not responsible for any violations of Reddit's policies.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
            <p>The materials on Post Content are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at nurgasab@gmail.com</p>
          </section>
        </div>
      </div>
    </Layout>
  )
} 