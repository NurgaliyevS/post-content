import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { refreshAccessToken } from '@/utils/refreshAccessToken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  async function fetchSubreddits(accessToken) {
    const response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'RedditScheduler/1.0.0'
      }
    });

    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Non-JSON response: ${text.substring(0, 100)}...`);
    }

    return response.json();
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!session.accessToken) {
      return res.status(400).json({ error: 'Reddit access token not available' });
    }

    let data;
    try {
      // First attempt with current token
      data = await fetchSubreddits(session.accessToken);
    } catch (error) {
      if (error.message === 'UNAUTHORIZED' && session.refreshToken) {
        console.log('Token expired, attempting refresh...');
        // Try refreshing the token
        const refreshedTokens = await refreshAccessToken(session.refreshToken);
        
        // Retry with new token
        data = await fetchSubreddits(refreshedTokens.access_token);
        
        // Update session token for future requests
        session.accessToken = refreshedTokens.access_token;
      } else {
        throw error;
      }
    }

    // Filter out user profiles (which start with 'u_')
    data.data.children = data.data.children.filter(child => !child.data.display_name.startsWith('u_'));

    const subreddits = data.data.children.map(child => child.data);

    // Add test subreddit for development
    subreddits.push({
      display_name: "test",
      display_name_prefixed: "r/test",
      title: "Testing subreddit",
      subscribers: 10000,
      url: "/r/test",
      created_utc: Date.now() / 1000,
      description: "A subreddit for testing"
    });

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