import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectMongoDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      setup_completed: user.setup_completed || false,
      setup_data: user.setup_data || null
    });

  } catch (error) {
    console.error("Setup status check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 