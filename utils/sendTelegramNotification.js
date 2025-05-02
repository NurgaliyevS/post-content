import axios from "axios";

// Add this function to send Telegram notifications
async function sendTelegramNotification({ 
  message, 
  chatId = process.env.TELEGRAM_CHAT_ID, 
  botToken = process.env.TELEGRAM_BOT_TOKEN 
}) {
  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}

export default sendTelegramNotification;
