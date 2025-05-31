import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function Affiliates() {
  const [referrals, setReferrals] = useState(10);
  const [plan, setPlan] = useState("growth");

  // Calculate earnings based on referrals
  const effectiveReferrals = referrals || 1;
  const commission = plan === "growth" ? 12.5 : 17.5;
  const earnings = effectiveReferrals * commission;

  const handleBecomeAnAffiliate = () => {
    window.open("https://post-content.affonso.io", "_blank");
  };

  return (
    <Layout>
      <Head>
        <title>Affiliates - Post Content</title>
        <meta
          name="description"
          content="Earn while you sleep with affiliate commissions on Post Content."
        />
      </Head>
      <main className="flex flex-col items-center justify-center px-4 py-16">
        <section className="text-center px-4 py-16 mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Increase your revenue with affiliate commissions
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Make 50% of every sale you invite
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              className="btn btn-primary btn-wide md:w-48"
              onClick={handleBecomeAnAffiliate}
            >
              <FaArrowRight className="w-3 h-3" />
              Become an affiliate
            </button>
          </div>
        </section>
        <section className="w-full max-w-3xl text-center">
          {/* Plan Toggle */}
          <div className="flex justify-center mb-8 gap-4">
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="plan"
                  className="radio checked:bg-primary"
                  checked={plan === "growth"}
                  onChange={() => setPlan("growth")}
                />
                <span className="label-text font-semibold">Growth ($25)</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="plan"
                  className="radio checked:bg-primary"
                  checked={plan === "hypergrowth"}
                  onChange={() => setPlan("hypergrowth")}
                />
                <span className="label-text font-semibold">Hypergrowth ($35)</span>
              </label>
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-6">
            You can make{" "}
            <span className="bg-black text-white px-4 py-1 rounded-md">
              ${earnings}
            </span>{" "}
            today
          </h2>
          <p className="text-xl mb-16">
            And you would help <span className="font-bold">{referrals}</span>{" "}
            creators turn their side projects into full-time businesses
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
