import { useState } from "react";
import { FaArrowRight, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function PricingSection() {
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const referralId =
    typeof window !== "undefined" ? window.affonso_referral : null;

  const handleSubscription = async (plan) => {
    try {
      // VISIT WEBSITE WITH REFERRAL ID
      console.log("referralId", referralId);

      setLoading(true);
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          planDetails: getPlanDetails(plan),
          affonso_referral: referralId,
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
      redditPartner: {
        name: "Reddit Partner",
        price: 100000, // in cents
      },
      hypergrowth: {
        name: "Hypergrowth",
        post_available: 100,
        price: 3500, // in cents
      },
      growth: {
        name: "Growth",
        post_available: 50,
        price: 2500, // in cents
      },
    };
    return details[plan];
  };

  return (
    <section id="pricing" className="py-16 px-4 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
        {/* Growth Plan */}
        <div className="card bg-base-100 border">
          <div className="card-body relative">
            <h3 className="card-title">Growth</h3>
            <div className="mb-2">
              <div className="text-lg text-gray-400 line-through">
                $35<span className="text-sm">/month</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                $25<span className="text-sm text-gray-500">/month</span>
              </div>
              <div className="badge badge-success badge-sm">Save $10/month</div>
            </div>
            <span className="text-sm text-gray-500 mb-4">
              Perfect for solopreneurs ready to learn Reddit marketing and
              build their first audience.
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span>✓</span> 50 posts per month
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Schedule posts on the best time
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Cross-posting to relevant subreddits
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
                    After buying this plan, you will get automatically email
                    with a link to schedule a call with us. But it does not stop
                    here, we will help you with:
                    <ul className="mt-2">
                      <li>
                        <span>✓</span> Content creation
                      </li>
                      <li>
                        <span>✓</span> Outreach to customers
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>

            <button
              onClick={() => handleSubscription("growth")}
              disabled={loading}
              className="btn btn-outline mt-4 btn-wide md:w-full"
            >
              <FaArrowRight className="w-3 h-3" />
              {loading ? "Loading..." : "Get Started"}
            </button>
          </div>
        </div>

        {/* Hypergrowth Plan */}
        <div className="card bg-base-100 border border-primary">
          <div className="card-body relative">
            <h3 className="card-title">Hypergrowth</h3>
            <div className="mb-2">
              <div className="text-lg text-gray-400 line-through">
                $50<span className="text-sm">/month</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                $35<span className="text-sm text-gray-500">/month</span>
              </div>
              <div className="badge badge-success badge-sm">Save $15/month</div>
            </div>
            <span className="text-sm text-gray-500 mb-4">
              For ambitious founders who want to grow on Reddit while building business.
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span>✓</span> 100 posts per month
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Schedule posts on the best time
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Cross-posting to relevant subreddits
              </li>
              <li className="flex items-center gap-2 relative">
                <span>✓</span> 
                <p className="text-nowrap">
                  Hypergrowth consulting{" "}
                  </p>
                <button
                  className="inline-flex"
                  onMouseEnter={() => setActiveTooltip("hypergrowth")}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <FaInfoCircle className="text-gray-400" />
                </button>
                {activeTooltip === "hypergrowth" && (
                  <div className="absolute left-0 bottom-full mb-2 p-3 bg-gray-800 text-white text-sm rounded w-64 z-10">
                    After buying this plan, you will get automatically email
                    with a link to schedule a call with us. But it does not stop
                    here, we will help you with:
                    <ul className="mt-2">
                      <li>
                        <span>✓</span> Content creation
                      </li>
                      <li>
                        <span>✓</span> Outreach to customers
                      </li>
                      <li>
                        <span>✓</span> Optimizing your Reddit profile
                      </li>
                      <li>
                        <span>✓</span> Driving leads to your website
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
            <button
              onClick={() => handleSubscription("hypergrowth")}
              disabled={loading}
              className="btn btn-primary mt-4 btn-wide md:w-full"
            >
              <FaArrowRight className="w-3 h-3" />
              {loading ? "Loading..." : "Get Started"}
            </button>
          </div>
        </div>

        {/* Reddit Partner Plan */}
        <div className="card bg-base-100 border">
          <div className="card-body relative">
            <h3 className="card-title">Reddit Partner</h3>
            <div className="mb-2">
              <div className="text-lg text-gray-400 line-through">
                $1500<span className="text-sm">/month</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                $1000<span className="text-sm text-gray-500">/month</span>
              </div>
              <div className="badge badge-success badge-sm">Save $500/month</div>
            </div>
            <span className="text-sm text-gray-500 mb-4">
              For busy founders who want to dominate on Reddit but don't have the time.
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span>✓</span> 2 updates per week
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> 100% personal-to-you content strategy
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> No contracts, cancel anytime
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Limited spots
              </li>
            </ul>
            <button
              onClick={() => handleSubscription("redditPartner")}
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
