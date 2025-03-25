import { buffer } from 'micro';
import Stripe from 'stripe';
import User from "@/backend/user";
import dbConnect from "@/backend/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

// checkout.session.completed
// customer.subscription.updated
// customer.subscription.deleted

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the raw body as a buffer
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'No signature found' });
    }

    // Verify the event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event type:', event.type);
    // console.log('Full webhook event:', JSON.stringify(event, null, 2));

    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout Session Data:', session);

        const email = session.customer_details.email;
        const name = session.customer_details.name;
        const redditUsername = session.custom_fields[0].text.value;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: 'https://www.redditscheduler.com/' // Where to return after portal session
        });
        
        // Use portalSession.url as the customer portal link
        const customerPortalUrl = portalSession.url;

        const user = await User.findOne({ name: redditUsername });

        if (!user) {
          await User.create({
            name: redditUsername,
            email: email,
            customer_portal_url: session.customer_portal_url,
          });
        }

        if (user) {
          await User.updateOne(
            { name: redditUsername },
            { $set: { email: email, customer_portal_url: session.customer_portal_url } }
          );
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(400).json({ error: error.message });
  }
} 