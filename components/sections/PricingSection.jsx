export default function PricingSection() {
    return (
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
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }