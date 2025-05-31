import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Affiliates() {
  const [referrals, setReferrals] = useState(1);

  // Calculate earnings based on referrals
  const effectiveReferrals = referrals || 1;
  const earnings = effectiveReferrals * 35;

  return (
    <Layout>
      <Head>
        <title>Affiliates - Post Content</title>
        <meta
          name="description"
          content="Earn by referring developers to Post Content."
        />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <section className="w-full max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            You can make{" "}
            <span className="bg-black text-white px-4 py-1 rounded-md">
              ${earnings}
            </span>{" "}
            today
          </h1>
          <p className="text-xl mb-16">
            And you would help <span className="font-bold">1</span> developers
            quit their 9-5 and build their dreams
          </p>
          <div className="flex items-center gap-4 mt-12 md:mt-20">
            <input
              type="range"
              min="1"
              max="100"
              value={referrals || 0}
              onChange={(e) => setReferrals(Number(e.target.value))}
              className="range w-full"
            />
            <span class="text-lg">
              <span class="font-bold">{referrals}</span> referrals
            </span>
          </div>
        </section>
      </main>
    </Layout>
  );
}
