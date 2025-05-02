import Stripe from "stripe";
import { Resend } from "resend";
import connectMongoDB from "@/backend/mongodb";
import User from "@/backend/user";
import { addDays, isBefore, differenceInDays } from "date-fns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectMongoDB();

    // Get all active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      expand: ["data.customer"],
    });

    const now = new Date();
    const oneWeekFromNow = addDays(now, 7);

    for (const subscription of subscriptions.data) {
      const renewalDate = new Date(subscription.current_period_end * 1000);
      console.log(renewalDate, "renewalDate");
      console.log(subscription.customer.email, "email");

      // Check if subscription renews in 7 days
      if (isBefore(renewalDate, oneWeekFromNow)) {
        const customer = subscription.customer;
        const user = await User.findOne({ email: customer.email });

        console.log(user?.lastReminderRenewalSent, "lastReminderRenewalSent");

        // Check if reminder was sent in the last 30 days
        if (user?.lastReminderRenewalSent) {
          // const daysSinceLastReminder = differenceInDays(now, user.lastReminderRenewalSent);
          const daysSinceLastReminder = differenceInDays(user.lastReminderRenewalSent, now);
          console.log(daysSinceLastReminder, "daysSinceLastReminder");
          
          if (daysSinceLastReminder < 25) {
            console.log(`Skipping ${customer.email} - reminder sent ${daysSinceLastReminder} days ago`);
            continue;
          }
        }

        const daysLeft = differenceInDays(renewalDate, now);

        const sendEmail = await resend.emails.send({
          from: "Post Content <sabyr@redditscheduler.com>",
          to: customer.email,
          subject: "Your Post Content Subscription Renewal Reminder",
          replyTo: "nurgasab@gmail.com",
          html: `
                <p>Hi ${customer?.name || customer?.email || "customer"},</p>

                <p>This is a friendly reminder that your Post Content subscription will renew in ${daysLeft} days.</p>

                <p>Do you need help with anything? Even if it is not related to Post Content, I'm here to help you.</p>

                <p>You can schedule a call with me here: <a href="https://cal.com/sabyr-nurgaliyev/15min">Schedule a Call</a> or just reply to this email.</p>

                <p>I want to make your business grow.</p>

                <p>Bye,</p>

                <p>Sabyr</p>
              `,
        });

        console.log(sendEmail, "sendEmail to ", customer.email);

        // Update the lastReminderSent date
        if (user) {
          await User.findOneAndUpdate(
            { email: customer.email },
            { $set: { lastReminderRenewalSent: now } }
          );
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in subscription reminder webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
