import Stripe from "stripe";
import { buffer } from "micro";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";
import sendFirstSubscriptionEmail from "@/utils/sendFirstSubscriptionEmail";
import sendTelegramNotification from "@/utils/sendTelegramNotification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectMongoDB();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata;
    const redditUser = session?.custom_fields?.[0]?.text?.value;

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // Check if the subscription is in trial period
    const isInTrial = subscription?.status === "trialing";

    console.log("subscription", subscription?.status);
    const trialEndsAt = isInTrial
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    console.log("trialEndsAt", trialEndsAt);

    const user = await User.find({ name: redditUser });

    const payload = {
      subscription_id: session.subscription,
      variant_name: metadata.plan,
      subscription_renews_at: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
      customer_id: session.customer,
      customer_name: session.customer_details.name,
      post_available: parseInt(metadata.post_available),
      is_in_trial: isInTrial,
      trial_ends_at: trialEndsAt,
    };

    if (session?.customer_details?.email) {
      payload.email = session.customer_details.email;
    }

    if (session?.customer_email) {
      payload.email = session.customer_email;
    }

    let message;
    message = `🎉 New Subscription Started!

👤 Customer ID: ${subscription.customer}
📧 Email: ${payload?.email}
⭐ Plan: ${payload?.variant_name}
📝 Posts Available: ${payload?.post_available}
👋 Customer Name: ${payload?.customer_name}`;
    await sendTelegramNotification(message);

    console.log(payload, "payload in checkout.session.completed");

    if (user) {
      await User.findOneAndUpdate(
        { name: redditUser },
        { $set: payload },
        { new: true, upsert: true }
      );
    } else {
      await User.create(payload);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;

    // Check if the subscription status has changed from trial to active
    const isInTrial = subscription?.status === "trialing";
    console.log(subscription.status, "subscription.status");
    const trialEndsAt = isInTrial
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;
    console.log("trialEndsAt", trialEndsAt);

    const payload = {
      is_in_trial: isInTrial,
      trial_ends_at: trialEndsAt,
    };

    // if the subscription has been cancelled
    if (subscription?.cancel_at_period_end) {
      payload.subscription_renews_at = null;
    }

    console.log(payload, "payload in customer.subscription.updated");

    await User.findOneAndUpdate(
      { customer_id: subscription.customer },
      { $set: payload }
    );
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;

    // Retrieve full subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const user = await User.findOne({ customer_id: invoice.customer });

    const payload = {
      post_available: parseInt(subscription.metadata.post_available),
      subscription_renews_at: new Date(invoice.period_end * 1000).toISOString(),
      ends_at: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
    };

    console.log(invoice.billing_reason, "invoice.billing_reason");
    console.log(user, 'user');

    // Check if this payment marks the end of a trial period
    if (invoice.billing_reason === "subscription_cycle") {
      payload.is_in_trial = false;
      payload.trial_ends_at = null;
    }

    if (user) {
      const userPlan = user.variant_name;
      if (userPlan === "starter") {
        payload.post_available = 10;
      } else if (userPlan === "growth") {
        payload.post_available = 50;
      } else if (userPlan === "scale") {
        payload.post_available = 100;
      }

      console.log(payload, "payload in invoice.payment_succeeded");

      await User.findOneAndUpdate(
        { customer_id: invoice.customer },
        { $set: payload }
      );

      console.log(invoice?.billing_reason, 'invoice?.billing_reason');
      console.log(!user?.has_received_first_subscription_email, '!user?.has_received_first_subscription_email');

      // Check if this is the first subscription payment and email hasn't been sent
      if (
        invoice?.billing_reason === "subscription_create" &&
        !user?.has_received_first_subscription_email
      ) {
        if (user?.email && user?.customer_name) {
          console.log('Sending email using user data...');
          const emailSent = await sendFirstSubscriptionEmail(user.email, user.customer_name);
          console.log('Email sent result:', emailSent);
          // Update user to mark that the email has been sent
          await User.findOneAndUpdate(
            { customer_id: invoice.customer },
            { $set: { has_received_first_subscription_email: true } }
          );
        } else if (
          !user?.email &&
          !user?.customer_name &&
          invoice?.customer_email &&
          invoice?.customer_name
        ) {
          console.log('Sending email using invoice data...');
          const emailSent = await sendFirstSubscriptionEmail(
            invoice.customer_email,
            invoice.customer_name
          );
          console.log('Email sent result:', emailSent);
          // Update user to mark that the email has been sent
          await User.findOneAndUpdate(
            { customer_id: invoice.customer },
            { $set: { has_received_first_subscription_email: true } }
          );
        } else {
          console.log('No valid email data found to send email');
        }
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    const payload = {
      variant_name: "free", // Reset to free plan
      subscription_renews_at: null,
      ends_at: new Date().toISOString(), // Set to current date since it's canceled immediately
      subscription_id: null, // Optional: Clear the subscription ID
      is_in_trial: false,
      trial_ends_at: null,
      post_available: 0,
    };

    console.log(payload, "payload in customer.subscription.deleted");

    await User.findOneAndUpdate(
      { customer_id: subscription.customer },
      { $set: payload }
    );
  }

  return res.status(200).json({ received: true });
}
