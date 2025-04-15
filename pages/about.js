import Head from 'next/head'
import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - Post Content</title>
        <meta name="description" content="Learn more about Post Content" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About Post Content</h1>
        
        <div className="prose prose-lg">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>Post Content is dedicated to helping Reddit users manage their content more efficiently. We believe in making social media management simple, effective, and accessible to everyone.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mt-2">
              <li>Schedule posts across multiple subreddits</li>
              <li>Manage your content calendar</li>
              <li>Track post performance</li>
              <li>Automate your Reddit presence</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p>We are committed to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>User privacy and data security</li>
              <li>Compliance with Reddit's terms of service</li>
              <li>Continuous improvement of our platform</li>
              <li>Providing excellent customer support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you!</p>
            <p className="mt-2">Email us at: nurgasab@gmail.com</p>
          </section>
        </div>
      </div>
    </Layout>
  )
} 