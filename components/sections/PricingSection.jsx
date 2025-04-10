import { useState } from "react";
import { FaArrowRight, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function PricingSection() {
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleSubscription = async (plan) => {
    try {
      setLoading(true);
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          planDetails: getPlanDetails(plan),
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanDetails = (plan) => {
    const details = {
      starter: {
        name: "Starter",
        post_available: 10,
        price: 900, // in cents
      },
      growth: {
        name: "Growth",
        post_available: 50,
        price: 1800, // in cents
      },
      scale: {
        name: "Scale",
        post_available: 150,
        price: 2700, // in cents
      },
    };
    return details[plan];
  };

  return (
    <section id="pricing" className="py-16 px-4 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
          <FaShieldAlt className="text-xl" />
          <span className="font-semibold">30-Day Money-Back Guarantee</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mx-auto">
        {/* Starter Plan */}
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="card-title">Starter</h3>
            <div className="text-3xl font-bold mb-4">
              $9<span className="text-sm text-gray-500">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span>✓</span> 10 posts per month
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Schedule posts
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Cross-posting
              </li>
              <li className="flex items-center gap-2 relative">
                <span>✓</span> Growth consulting{" "}
                <button 
                  className="inline-flex"
                  onMouseEnter={() => setActiveTooltip("starter")}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <FaInfoCircle className="text-gray-400" />
                </button>
                {activeTooltip === "starter" && (
                  <div className="absolute left-0 bottom-full mb-2 p-3 bg-gray-800 text-white text-sm rounded w-64 z-10">
                    Direct communication to help you grow on Reddit (from 1M+ impressions)
                  </div>
                )}
              </li>
            </ul>
            <button
              onClick={() => handleSubscription("starter")}
              disabled={loading}
              className="btn btn-outline mt-4 btn-wide md:w-full"
            >
              <FaArrowRight className="w-3 h-3" />
              {loading ? "Loading..." : "Get Started"}
            </button>
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
                <span>✓</span> 50 posts per month
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Schedule posts
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Cross-posting
              </li>
              <li className="flex items-center gap-2 relative">
                <span>✓</span> Growth consulting{" "}
                <button 
                  className="inline-flex"
                  onMouseEnter={() => setActiveTooltip("growth")}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <FaInfoCircle className="text-gray-400" />
                </button>
                {activeTooltip === "growth" && (
                  <div className="absolute left-0 bottom-full mb-2 p-3 bg-gray-800 text-white text-sm rounded w-64 z-10">
                    Direct communication to help you grow on Reddit (from 1M+ impressions)
                  </div>
                )}
              </li>
            </ul>
            <button
              onClick={() => handleSubscription("growth")}
              disabled={loading}
              className="btn btn-primary mt-4 btn-wide md:w-full"
            >
              <FaArrowRight className="w-3 h-3" />
              {loading ? "Loading..." : "Get Started"}
            </button>
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
                <span>✓</span> 150 posts per month
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Schedule posts
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Cross-posting
              </li>
              <li className="flex items-center gap-2 relative">
                <span>✓</span> Growth consulting{" "}
                <button 
                  className="inline-flex"
                  onMouseEnter={() => setActiveTooltip("scale")}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <FaInfoCircle className="text-gray-400" />
                </button>
                {activeTooltip === "scale" && (
                  <div className="absolute left-0 bottom-full mb-2 p-3 bg-gray-800 text-white text-sm rounded w-64 z-10">
                    Direct communication to help you grow on Reddit (from 1M+ impressions)
                  </div>
                )}
              </li>
            </ul>
            <button
              onClick={() => handleSubscription("scale")}
              disabled={loading}
              className="btn btn-outline mt-4 btn-wide md:w-full"
            >
              <FaArrowRight className="w-3 h-3" />
              {loading ? "Loading..." : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}