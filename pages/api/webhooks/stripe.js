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

const addPostCount = (plan) => {
  switch (plan) {
    case "free":
      return 0;
    case "Starter":
      return 10;
    case "Growth":
      return 50;
    case "Scale":
      return 150;
  }
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
          let user = await User.findOne({ customer_id: customerId });

          // because the user is already subscribed, we update the user with the new subscription details
          if (user && portalSession.url && !subscription?.plan?.nickname) {
            const planName =
              subscription.plan.nickname ||
              subscription.items.data[0].price.metadata?.plan_name ||
              "Unknown Plan";

            console.log(planName, "planName");

            console.log(subscription.plan.nickname, "subscription.plan.nickname");
            console.log(subscription.items.data[0], "subscription.items.data[0]");
            console.log(subscription.items.data[0].price, "subscription.items.data[0].price");

            const userData = {
              customer_portal_url: portalSession.url,
              subscription_renews_at: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              subscription_id: subscriptionId,
            };

            await User.findOneAndUpdate(
              { customer_id: customerId },
              { $set: userData },
              { new: true, upsert: true }
            );
            break;
          }

          // first time subscribed
          let userExisted = await User.findOne({ name: redditUsername });

          console.log(subscription, "subscription");
          console.log(subscription.items, 'items');
          console.log(subscription.items.data[0], 'items.data[0]');
          console.log(subscription.items.data[0].plan, 'plan');

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

          userData.post_available = addPostCount(subscription.plan.nickname);

          // if user doesn't exist, create new user
          if (!userExisted) {
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

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const cancelAtPeriodEnd = subscription.cancel_at_period_end;
        const canceledAt = subscription.canceled_at;
        const customerId = subscription.customer;

        const user = await User.findOne({ customer_id: customerId });

        if (cancelAtPeriodEnd && user) {
          await User.findOneAndUpdate(
            { customer_id: customerId },
            {
              $set: {
                ends_at: canceledAt,
                subscription_renews_at: null,
                variant_name: "free",
                ends_at: canceledAt,
              },
            }
          );
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).json({ error: error.message });
  }
}
