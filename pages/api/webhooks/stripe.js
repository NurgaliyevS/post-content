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

        try {
          let user = await User.findOne({ name: redditUsername });

          // because the user is already subscribed, we update the user with the new subscription details
          if (user && portalSession.url && !subscription?.plan?.nickname) {
            const userData = {
              customer_portal_url: portalSession.url,
              // TODO: find variant_name now it is null
              subscription_renews_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              customer_id: customerId,
              subscription_id: subscriptionId,
            };

            await User.findOneAndUpdate(
              { name: redditUsername },
              { $set: userData },
              { new: true, upsert: true }
            );
            break;
          }

          const userData = {
            name: redditUsername,
            customer_name: name,
            email: email,
            customer_portal_url: portalSession.url,
            variant_name: subscription.plan.nickname,
            subscription_renews_at: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            customer_id: customerId,
            subscription_id: subscriptionId,
          };

          // if user doesn't exist, create new user
          if (!user) {
            user = await User.create(userData);
            // first time subscribed
          } else {
            user = await User.findOneAndUpdate(
              { name: redditUsername },
              { $set: userData },
              { new: true, upsert: true }
            );
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Handle potential duplicate key errors
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        // make sure to find user via session.custom_fields[0].text.value

        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ error: error.message });
  }
}
