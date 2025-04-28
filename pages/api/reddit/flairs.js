import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { refreshAccessToken } from '@/utils/refreshAccessToken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subreddit } = req.query;

  if (!subreddit) {
    return res.status(400).json({ error: 'Subreddit name is required' });
  }

  // Remove r/ prefix if it exists
  const cleanSubreddit = subreddit.replace(/^r\//, '');

  async function fetchFlairs(accessToken) {
    const response = await fetch(`https://oauth.reddit.com/r/${cleanSubreddit}/api/link_flair_v2`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Post Content/1.0.0'
      }
    });

    console.log('Reddit API response status:', response.status);
    
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.log('Non-JSON response:', text);
      throw new Error(`Non-JSON response: ${text}`);
    }

    const data = await response.json();
    console.log('Reddit API response data:', JSON.stringify(data, null, 2));

    // Process and return flairs
    const flairs = data.choices?.map(flair => ({
      id: flair.flair_template_id,
      text: flair.flair_text,
      cssClass: flair.flair_css_class,
      textEditable: flair.flair_text_editable
    })) || [];

    return { choices: flairs };
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
      data = await fetchFlairs(session.accessToken);
    } catch (error) {
      if (error.message === 'UNAUTHORIZED' && session.refreshToken) {
        console.log('Token expired, attempting refresh...');
        const refreshedTokens = await refreshAccessToken(session.refreshToken);
        data = await fetchFlairs(refreshedTokens.access_token);
        session.accessToken = refreshedTokens.access_token;
      } else {
        console.error('Error fetching flairs:', error);
        throw error;
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in flairs endpoint:', error);
    return res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
} 