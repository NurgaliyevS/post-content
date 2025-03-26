import { isDevelopment } from "@/utils/isDevelopment";

export default function PricingSection() {
    const getStripeLink = (plan) => {
      if (isDevelopment) {
        switch(plan) {
          case 'starter':
            return 'https://buy.stripe.com/test_14kaGJ0LdgF8cRG3cd';
          case 'growth': 
            return 'https://buy.stripe.com/test_aEU0251Ph4Wqg3SdQS';
          case 'scale':
            return 'https://buy.stripe.com/test_scale_link';
          default:
            return '#';
        }
      } else {
        switch(plan) {
          case 'starter':
            return 'https://buy.stripe.com/prod_starter_link';
          case 'growth':
            return 'https://buy.stripe.com/prod_growth_link'; 
          case 'scale':
            return 'https://buy.stripe.com/prod_scale_link';
          default:
            return '#';
        }
      }
    };

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
              <a href={getStripeLink('starter')} className="btn btn-outline mt-4 w-full">Buy Now</a>
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
              <a href={getStripeLink('growth')} className="btn btn-primary mt-4 w-full">Buy Now</a>
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
              <a href={getStripeLink('scale')} className="btn btn-outline mt-4 w-full">
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }