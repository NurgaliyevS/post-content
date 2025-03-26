import Stripe from 'stripe';
import { buffer } from 'micro';
import User from '@/backend/user';
import connectMongoDB from '@/backend/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectMongoDB();

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata;
        const redditUser = session?.custom_fields?.[0]?.text?.value;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        const user = await User.find({ name: redditUser });

        const payload = {
          subscription_id: session.subscription,
          variant_name: metadata.plan,
          subscription_renews_at: new Date(subscription.current_period_end * 1000).toISOString(),
          ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
          customer_id: session.customer,
          subscription_id: session.subscription,
          customer_name: session.customer_details.name,
          post_available: parseInt(metadata.post_available),
        }

        if (session?.customer_details?.email) {
          payload.email = session.customer_details.email;
        }

        if (session?.customer_email) {
          payload.email = session.customer_email;
        }

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

    if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;

        // if the subscription has been cancelled
        if (subscription?.cancel_at_period_end) {
          const payload = {
            subscription_renews_at: null,
          }

          console.log(payload, "payload in customer.subscription.updated");

          await User.findOneAndUpdate(
            { customer_id: subscription.customer },
            { $set: payload }
          );
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
  
      // Retrieve full subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const user = await User.findOne({ customer_id: invoice.customer });

      const payload = {
        post_available: parseInt(subscription.metadata.post_available),
        subscription_renews_at: new Date(invoice.period_end * 1000).toISOString(),
        ends_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
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
      }
    }

    return res.status(200).json({ received: true });
}