import User from "@/backend/user";
import connectMongoDB from "@/backend/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: session.user.email });
    res.status(200).json(user);
  }
}
