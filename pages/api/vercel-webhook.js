import sendTelegramNotification from "@/utils/sendTelegramNotification";

export default async function handler(req, res) {
  // Verify the request is coming from Vercel
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verify webhook secret
  const signature = req.headers["x-vercel-signature"];
  if (signature !== process.env.VERCEL_WEBHOOK_SECRET) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  try {
    const { type, payload } = req.body;

    console.log(req.body, "req.body here");
    console.log(type, "type");
    console.log(payload, "payload");

    let message = "";

    message = `
🚨 Error Alert
Type: ${type}
Project: ${payload.project?.name || "Unknown"}
Environment: ${payload?.target || "Unknown"}
Error: ${payload.error?.message || "Unknown error"}
`;

    // Send notification to Telegram
    await sendTelegramNotification(message);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
