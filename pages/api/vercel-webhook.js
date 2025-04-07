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

    console.log(type, "type");
    console.log(payload, "payload");

    // Process both error events and firewall attacks
    // if (!type.includes('error') && !type.includes('failed') && !type.includes('firewall')) {
    //   return res.status(200).json({ success: true });
    // }

    let message = "";

    message = `
🚨 <b>Error Alert</b>
Type: ${type}
Project: ${payload.project?.name || "Unknown"}
Environment: ${payload?.target || "Unknown"}
Error: ${payload.error?.message || "Unknown error"}
`;

    //     if (type.includes('firewall')) {
    //       message = `
    // ⚠️ <b>Security Alert: Attack Detected</b>
    // Project: ${payload.project?.name || 'Unknown'}
    // Source IP: ${payload.source || 'Unknown'}
    // Attack Type: ${payload.attackType || 'Unknown'}
    // Region: ${payload.region || 'Unknown'}
    // URL Path: ${payload.path || 'Unknown'}
    // Timestamp: ${new Date().toISOString()}`;
    //     } else {
    //       message = `
    // 🚨 <b>Error Alert</b>
    // Type: ${type}
    // Project: ${payload.project?.name || 'Unknown'}
    // Environment: ${payload.target || 'Unknown'}
    // Error: ${payload.error?.message || 'Unknown error'}
    // Stack: ${payload.error?.stack || 'No stack trace'}
    // URL: ${payload.url || 'N/A'}
    // Timestamp: ${new Date().toISOString()}
    // ${payload.error?.context ? `\nContext: ${JSON.stringify(payload.error.context)}` : ''}`;
    //     }

    // Send notification to Telegram
    await sendTelegramNotification(message);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
