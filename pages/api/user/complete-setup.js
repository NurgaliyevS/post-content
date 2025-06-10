import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/backend/user";
import connectDB from "@/backend/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await connectDB();

    const { setupData, recommendedSubreddits } = req.body;

    if (!setupData || !setupData.productLink || !setupData.needs || !setupData.goals) {
      return res.status(400).json({ error: "Missing required setup data" });
    }

    // Update user with setup completion data
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          setup_completed: true,
          setup_data: {
            productLink: setupData.productLink,
            needs: setupData.needs,
            goals: setupData.goals,
            recommendedSubreddits: recommendedSubreddits || [],
            completedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Setup completed successfully",
      user: {
        id: updatedUser._id,
        setup_completed: updatedUser.setup_completed
      }
    });

  } catch (error) {
    console.error("Setup completion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 