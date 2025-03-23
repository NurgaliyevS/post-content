/**
 * Utility function to refresh Reddit access token
 */
export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }
  
    const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
    const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
  
    // Reddit requires Basic Auth for token refresh
    const basicAuth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
  
    try {
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'RedditScheduler/1.0.0'
        },
        body: new URLSearchParams({
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh token');
      }
  
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken, // Some providers don't return a new refresh token
        expires_at: Date.now() + (data.expires_in * 1000)
      };
    } catch (error) {
      console.error('Error refreshing Reddit token:', error);
      throw error;
    }
  }