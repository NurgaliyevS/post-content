import { buffer } from "micro";
import Stripe from "stripe";
import User from "@/backend/user";
import dbConnect from "@/backend/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the raw body as a buffer
    const rawBody = await buffer(req);
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ error: "No signature found" });
    }

    // Verify the event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Webhook event type:", event.type);

    await dbConnect();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.customer_details.email;
        const name = session.customer_details.name;
        const redditUsername = session.custom_fields[0].text.value;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        // Create customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: "https://www.redditscheduler.com/dashboard",
        });

        // Retrieve subscription details
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        console.log("Subscription:", subscription);

        try {
          // Find or create user
          let user = await User.findOne({ name: redditUsername });

          const userData = {
            name: redditUsername,
            email: email,
            customer_portal_url: portalSession.url,
            variant_name: subscription.plan.nickname,
            subscription_renews_at: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            customer_id: customerId,
            subscription_id: subscriptionId,
          };

          if (!user) {
            user = await User.create(userData);
          } else {
            user = await User.findOneAndUpdate(
              {
                name: redditUsername,
                email: email,
                customer_portal_url: portalSession.url,
                variant_name: subscription.plan.nickname,
                subscription_renews_at: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
                customer_id: customerId,
                subscription_id: subscriptionId,
              },
              { $set: userData },
              { new: true, upsert: true }
            );
          }

          console.log("User created/updated:", user);
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Handle potential duplicate key errors
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const result = await User.findOneAndUpdate(
          { customer_id: customerId },
          {
            subscription_renews_at: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            ends_at: null,
            variant_name: subscription.status === "active" ? "starter" : "free",
          },
          { new: true }
        );
        console.log("Subscription Update Result:", result);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const result = await User.findOneAndUpdate(
          { customer_id: customerId },
          {
            variant_name: "free",
            subscription_renews_at: null,
            ends_at: new Date(subscription.canceled_at * 1000).toISOString(),
          },
          { new: true }
        );
        console.log("Subscription Deletion Result:", result);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ error: error.message });
  }
}
