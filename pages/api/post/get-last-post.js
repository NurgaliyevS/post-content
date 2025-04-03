import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await connectMongoDB();

    // find the last post
    const lastPost = await ScheduledPost.findOne({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ lastPost });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
