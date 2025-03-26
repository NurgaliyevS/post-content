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

  await connectMongoDB();

  try {
    const session = await getServerSession(req, res, authOptions);

    const { plan, planDetails } = req.body;

    const createLink = {
      mode: "subscription",
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
              name: `Reddit Scheduler - ${planDetails.name}`,
              description: `Creator access to Reddit Scheduler.  ${planDetails.post_available} posts to schedule per month.`,
              metadata: {
                post_available: planDetails.post_available,
              },
            },
            unit_amount: planDetails.price,
            recurring: {
              interval: "month",
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
      },
    };

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
