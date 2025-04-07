// pages/api/test-telegram.js
import sendTelegramNotification from "@/utils/sendTelegramNotification";

export default async function handler(req, res) {
  try {
    await sendTelegramNotification("🧪 This is a test notification from the API");
    res.status(500).json({ error: "Test notification failed" });
  } catch (error) {
    console.error("Test notification failed:", error);
    res.status(500).json({ error: error.message });
  }
}