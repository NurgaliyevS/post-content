import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Instead of using cookies() from next/headers, access cookies from the request
  const visitorId = req?.cookies?.datafast_visitor_id;
  const sessionId = req?.cookies?.datafast_session_id;

  console.log("visitorId", visitorId);
  console.log("sessionId", sessionId);
  console.log(req.body.affonso_referral, "affonso_referral")
  await connectMongoDB();
  try {
    const session = await getServerSession(req, res, authOptions);

    const { plan, planDetails, billingCycle, affonso_referral } = req.body;

    const createLink = {
      mode: "subscription",
      allow_promotion_codes: true,
      custom_fields: [
        {
          key: "reddit_username",
          label: {
            type: "custom",
            custom: "Reddit Username",
          },
          type: "text",
          optional: false, // set to true if you want to make it optional
        },
      ],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Post Content - ${planDetails.name}`,
              // description: `Creator access to Post Content. ${planDetails.post_available} posts to schedule per month. 30 days money back guarantee.`,
              metadata: {
                post_available: planDetails.post_available,
              },
            },
            unit_amount: planDetails.price,
            recurring: {
              interval: billingCycle === "yearly" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/onboarding`,
      cancel_url: `${process.env.NEXTAUTH_URL}#pricing`,
      metadata: {
        plan,
        post_available: planDetails.post_available,
        billingCycle,
        visitorId,
        sessionId,
        affonso_referral,
      },
    };

    if (planDetails.name === "Reddit Partner") {
      createLink.line_items[0].price_data.product_data.description = "For busy founders who want to grow on Reddit but don't have the time to do it themselves. 2 updates per week. 100% personal-to-you content strategy. No contracts, cancel anytime. Limited spots.";
    } else {
      const billingText = billingCycle === "yearly" ? "year" : "month";
      const guaranteeText = billingCycle === "yearly" ? "30 days money back guarantee" : "30 days money back guarantee";
      createLink.line_items[0].price_data.product_data.description = `Creator access to Post Content. ${planDetails.post_available} posts to schedule per ${billingText === "year" ? "month" : "month"}. ${guaranteeText}.`;
    }

    if (session?.user?.name) {
      const user = await User.find({ name: session.user.name });
      if (user) {
        createLink.customer = user.customer_id;
        createLink.metadata.userId = user?.customer_id || null;
      }
      try {
        if (user && user.customer_id) {
          customer = await stripe.customers.retrieve(String(user.customer_id));
        }
      } catch (error) {
        console.error("Error retrieving customer:", error);
      }
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create(createLink);

    return res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}