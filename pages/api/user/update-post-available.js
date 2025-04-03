import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    // Parse JSON body since it's coming as a string
    let body = {};
    if (req.body) {
      body = JSON.parse(req.body);
    }

    // by default, amountDecreased is 1
    const { amountDecreased = 1 } = body;

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await connectMongoDB();

    const user = await User.findOne({ name: session.user.name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only decrease meals for non-premium users
    if (user.post_available > 0) {
      user.post_available = user.post_available - amountDecreased;
      await user.save();
    }

    return res.status(200).json({
      post_available: user.post_available,
    });
  } catch (error) {
    console.error("Error updating meals:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
