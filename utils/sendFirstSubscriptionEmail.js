import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFirstSubscriptionEmail(email, username) {
  if (!email || !username) {
    console.error('Missing required parameters for email:', { email, username });
    return false;
  }
  console.log('Attempting to send email to person:', email);

  try {
    const { data, error } = await resend.emails.send({
      from: "Sabyr from Post Content <sabyr@redditscheduler.com>",
      to: email,
      subject: "Thank you, Post Content",
      replyTo: "nurgasab@gmail.com",
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

    if (error) {
      console.error('Resend API error:', error);
      return false;
    }

    if (data) {
      console.log('Email sent successfully:', data);
      return true;
    }

    console.log('No data or error returned from Resend API');
    return false;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

export default sendFirstSubscriptionEmail;
