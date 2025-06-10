import { useState } from "react";
import { FaArrowRight, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function PricingSection() {
  const [loading, setLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly

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
          billingCycle,
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
    const monthlyDetails = {
      redditPartner: {
        name: "Reddit Partner",
        price: 100000, // in cents
        originalPrice: 150000,
      },
      hypergrowth: {
        name: "Hypergrowth",
        post_available: 100,
        price: 3500, // in cents
        originalPrice: 5000,
      },
      growth: {
        name: "Growth",
        post_available: 50,
        price: 2500, // in cents
        originalPrice: 3500,
      },
    };

    const yearlyDetails = {
      redditPartner: {
        name: "Reddit Partner",
        price: 900000, // $900/year (3 months free from $1200)
        originalPrice: 1800000, // $1800/year (from original $1500/month)
      },
      hypergrowth: {
        name: "Hypergrowth",
        post_available: 100,
        price: 31500, // $315/year (3 months free from $420)
        originalPrice: 60000, // $600/year (from original $50/month)
      },
      growth: {
        name: "Growth",
        post_available: 50,
        price: 22500, // $225/year (3 months free from $300)
        originalPrice: 42000, // $420/year (from original $35/month)
      },
    };

    return billingCycle === "yearly" ? yearlyDetails[plan] : monthlyDetails[plan];
  };

  const formatPrice = (price) => {
    return billingCycle === "yearly" ? (price / 100).toFixed(0) : (price / 100).toFixed(0);
  };

  const formatOriginalPrice = (price) => {
    return billingCycle === "yearly" ? (price / 100).toFixed(0) : (price / 100).toFixed(0);
  };

  const getMonthlyEquivalent = (yearlyPrice) => {
    return (yearlyPrice / 100 / 12).toFixed(0);
  };

  return (
    <section id="pricing" className="py-16 px-4 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
      
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-full join border border-gray-300">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-content"
                : "text-base-content hover:bg-base-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full transition-all relative ${
              billingCycle === "yearly"
                ? "bg-primary text-primary-content"
                : "text-base-content hover:bg-base-300"
            }`}
          >
            Yearly
            <span className="absolute -top-4 -right-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full text-nowrap animate-bounce">
              3 MONTHS FREE
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
        {/* Growth Plan */}
        <div className="card bg-base-100 border">
          <div className="card-body relative">
            <h3 className="card-title">Growth</h3>
            <div className="mb-2">
              <div className="text-lg text-gray-400 line-through">
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("growth").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                ) : (
                  <>
                    ${formatOriginalPrice(getPlanDetails("growth").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                )}
              </div>
              <div className="text-3xl font-bold text-primary">
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("growth").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                ) : (
                  <>
                    ${formatPrice(getPlanDetails("growth").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                )}
              </div>
              {billingCycle === "yearly" && (
                <div className="text-sm text-gray-500 mb-1">
                  ${formatPrice(getPlanDetails("growth").price)} billed annually
                </div>
              )}
              <div className="badge badge-success badge-sm">
                {billingCycle === "yearly" ? "Save $195 with yearly pricing" : "Save $10/month"}
              </div>
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
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("hypergrowth").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                ) : (
                  <>
                    ${formatOriginalPrice(getPlanDetails("hypergrowth").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                )}
              </div>
              <div className="text-3xl font-bold text-primary">
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("hypergrowth").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                ) : (
                  <>
                    ${formatPrice(getPlanDetails("hypergrowth").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                )}
              </div>
              {billingCycle === "yearly" && (
                <div className="text-sm text-gray-500 mb-1">
                  ${formatPrice(getPlanDetails("hypergrowth").price)} billed annually
                </div>
              )}
              <div className="badge badge-success badge-sm">
                {billingCycle === "yearly" ? "Save $285 with yearly pricing" : "Save $15/month"}
              </div>
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
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("redditPartner").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                ) : (
                  <>
                    ${formatOriginalPrice(getPlanDetails("redditPartner").originalPrice)}
                    <span className="text-sm">/month</span>
                  </>
                )}
              </div>
              <div className="text-3xl font-bold text-primary">
                {billingCycle === "yearly" ? (
                  <>
                    ${getMonthlyEquivalent(getPlanDetails("redditPartner").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                ) : (
                  <>
                    ${formatPrice(getPlanDetails("redditPartner").price)}
                    <span className="text-sm text-gray-500">/month</span>
                  </>
                )}
              </div>
              {billingCycle === "yearly" && (
                <div className="text-sm text-gray-500 mb-1">
                  ${formatPrice(getPlanDetails("redditPartner").price)} billed annually
                </div>
              )}
              <div className="badge badge-success badge-sm">
                {billingCycle === "yearly" ? "Save $2700 with yearly pricing" : "Save $500/month"}
              </div>
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
