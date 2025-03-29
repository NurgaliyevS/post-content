import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { refreshAccessToken } from '@/utils/refreshAccessToken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let accessToken = session.accessToken;
    const refreshToken = session.refreshToken;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Reddit access token not available' });
    }

    // First attempt with current token
    let response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'RedditScheduler/1.0.0'
      }
    });

    // If unauthorized, try refreshing the token
    if (response.status === 401 && refreshToken) {
      try {
        console.log('Attempting to refresh token...');
        const refreshedTokens = await refreshAccessToken(refreshToken);
        accessToken = refreshedTokens.access_token;
        
        // Retry with new token
        response = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'RedditScheduler/1.0.0'
          }
        });
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return res.status(401).json({ 
          error: 'Authentication failed',
          details: 'Failed to refresh access token'
        });
      }
    }

    // Handle response after potential refresh
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorData;
      
      try {
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
      } catch (e) {
        errorData = 'Could not parse error response';
      }

      console.error('Reddit API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      return res.status(response.status).json({ 
        error: 'Failed to fetch subreddits',
        details: errorData
      });
    }

    const data = await response.json();

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