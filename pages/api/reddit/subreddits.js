import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get Reddit access token from session
    const accessToken = session.accessToken;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Reddit access token not available' });
    }

    // Fetch user's subscribed subreddits
    const response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'YourAppName/1.0.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Reddit API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to fetch subreddits',
        details: errorData
      });
    }

    const data = await response.json();

    // Filter out user profiles (which start with 'u_')
    data.data.children = data.data.children.filter(child => !child.data.display_name.startsWith('u_'));

    const subreddits = data.data.children.map(child => child.data);

    // Return subreddits with relevant information
    return res.status(200).json({ 
      subreddits,
      count: subreddits.length 
    });
  } catch (error) {
    console.error('Error fetching subreddits:', error);
    return res.status(500).json({ error: 'Failed to fetch subreddits' });
  }
}