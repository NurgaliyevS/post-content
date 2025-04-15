import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFirstSubscriptionEmail(email, username) {
  // Create an unsubscribe URL that points to your application
  //   const unsubscribeUrl = `https://redditscheduler.com/unsubscribe?email=${encodeURIComponent(email)}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Sabyr from Post Content <sabyr@redditscheduler.com>",
      to: email,
      subject: "Thank you, Post Content",
      replyTo: "nurgasab@gmail.com", // For receiving replies
      //   headers: {
      //     "List-Unsubscribe": `<${unsubscribeUrl}>`,
      //     "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      //   },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <p>Hi ${username},</p>

        <p>Thank you for choosing my tool!</p>

        <p>I want to help you grow on Reddit.</p>

        <p>If you want a free consultation, you can grab a spot here: 
        <a href="https://cal.com/sabyr-nurgaliyev/15min">https://cal.com/sabyr-nurgaliyev/15min</a>
        </p>

        <p>I will be happy to help you.</p>
        
        <p>Bye,</p>

        <p>Sabyr</p>

        <p>P.S. If you have any questions, feel free to reply to this email.</p>
        </div>
      `,
    });

    console.log(`First subscription email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

export default sendFirstSubscriptionEmail;
