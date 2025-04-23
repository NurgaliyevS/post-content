import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongoDB();

    // latest posts first
    const scheduledPosts = await ScheduledPost.find().sort({ createdAt: -1 });

    return res.status(200).json({ scheduledPosts });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
