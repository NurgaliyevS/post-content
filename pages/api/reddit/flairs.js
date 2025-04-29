import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subreddit } = req.query;

  if (!subreddit) {
    return res.status(400).json({ error: "Subreddit name is required" });
  }

  // Remove r/ prefix if it exists
  const cleanSubreddit = subreddit.replace(/^r\//, "");

  async function fetchFlairs(accessToken) {
    try {
      const response = await fetch(
        `https://oauth.reddit.com/r/${cleanSubreddit}/api/link_flair_v2.json?raw_json=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Post Content/1.0.0",
          },
        }
      );

      console.log("Reddit API response status:", response.status);

      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }

      if (response?.status === 403) {
        return res.status(403).json({
          error:
            "Reddit does not allow to submit posts to this subreddit. Please try a different subreddit.",
          message:
            "Reddit does not allow to submit posts to this subreddit. Please try a different subreddit.",
        });
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        throw new Error(`Non-JSON response: ${text}`);
      }

      const data = await response.json();
      console.log(data, "data");
      // Process and return flairs
      const flairs = Array.isArray(data)
        ? data.map((flair) => ({
            id: flair.id,
            text: flair.text,
            cssClass: flair.css_class,
            textEditable: flair.text_editable,
            backgroundColor: flair.background_color,
            textColor: flair.text_color,
            type: flair.type,
          }))
        : [];

      return { choices: flairs };
    } catch (error) {
      console.error("Error fetching flairs:", error);
      throw error;
    }
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!session.accessToken) {
      return res
        .status(400)
        .json({ error: "Reddit access token not available" });
    }

    let data;
    try {
      data = await fetchFlairs(session.accessToken);
    } catch (error) {
      if (error.message === "UNAUTHORIZED" && session.refreshToken) {
        console.log("Token expired, attempting refresh...");
        const refreshedTokens = await refreshAccessToken(session.refreshToken);
        data = await fetchFlairs(refreshedTokens.access_token);
        session.accessToken = refreshedTokens.access_token;
      } else {
        console.error("Error fetching flairs:", error);
        throw error;
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in flairs endpoint:", error);
    return res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
}
