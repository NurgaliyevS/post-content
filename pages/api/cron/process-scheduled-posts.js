import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

// This endpoint will be called by Vercel Cron
export default async function handler(req, res) {
  console.log(process.env.CRON_SECRET, 'CRON_SECRET');
  console.log(req.headers.authorization, 'authorization');
  console.log(req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`, 'authorization');
  // console.log('Received headers:', JSON.stringify(req.headers));
  
  // // Debug environment variables
  // console.log('Expected CRON_SECRET:', process.env.CRON_SECRET);
  
  // // Verify the cron job secret
  // const authHeader = req.headers['authorization'];
  // console.log('Received auth header:', authHeader);
  
  // if (!process.env.CRON_SECRET) {
  //   console.error('CRON_SECRET environment variable is not defined');
  //   return res.status(500).json({ error: 'Server configuration error: CRON_SECRET not defined' });
  // }
  
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   console.error('Auth failed: expected', `Bearer ${process.env.CRON_SECRET}`, 'got', authHeader);
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }
  
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Get current time
    const currentTime = new Date();
    
    // Find posts that are scheduled for now or earlier and still have 'scheduled' status
    const scheduledPosts = await ScheduledPost.find({ 
      scheduledFor: { $lte: currentTime },
      status: 'scheduled'
    });
    
    console.log(`Found ${scheduledPosts.length} posts to publish`);
    
    const results = [];
    
    for (const post of scheduledPosts) {
      try {
        // The access token might have expired, refresh it
        let accessToken = post.redditAccessToken;
        
        // Check if token needs refresh (tokens last 1 hour)
        const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
        if (post.createdAt < oneHourAgo) {
          console.log(`Refreshing token for post ${post._id}`);
          const refreshResult = await refreshAccessToken(post.redditRefreshToken);
          accessToken = refreshResult.access_token;
          
          // Update the token in the database
          post.redditAccessToken = accessToken;
          if (refreshResult.refresh_token) {
            post.redditRefreshToken = refreshResult.refresh_token;
          }
          await post.save();
        }
        
        // Make the API call to Reddit
        const redditApiUrl = `https://oauth.reddit.com/api/submit`;
        
        const requestBody = new URLSearchParams({
          'sr': post.community,
          'kind': post.type === 'text' ? 'self' : 'link',
          'title': post.title,
          'text': post.text || '',
          'api_type': 'json',
          'resubmit': 'true',
        });
        
        // If it's a link post, add the URL
        if (post.type === 'link' && post.url) {
          requestBody.append('url', post.url);
        }
        
        console.log(`Posting to r/${post.community}: ${post.title}`);
        
        const redditResponse = await fetch(redditApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'RedditScheduler/1.0.0'
          },
          body: requestBody
        });
        
        const redditData = await redditResponse.json();
        
        // Check for errors in the Reddit API response
        if (redditResponse.ok && redditData?.json?.data?.url) {
          // Update the post status
          post.status = 'published';
          post.publishedAt = new Date();
          post.redditPostUrl = redditData.json.data.url;
          post.redditPostId = redditData.json.data.id;
          await post.save();
          
          results.push({
            id: post._id,
            status: 'published',
            redditPostUrl: redditData.json.data.url
          });
          
          console.log(`Successfully published post ${post._id} to Reddit`);
        } else {
          // Handle failed publish
          post.status = 'failed';
          post.failedAt = new Date();
          post.failureReason = redditData.json?.errors?.join(', ') || 'Unknown error';
          await post.save();
          
          results.push({
            id: post._id,
            status: 'failed',
            error: redditData.json?.errors || 'Failed to publish post'
          });
          
          console.error(`Failed to publish post ${post._id}:`, redditData.json?.errors);
        }
      } catch (error) {
        console.error(`Error publishing post ${post._id}:`, error);
        
        // Update the post with error info
        post.status = 'failed';
        post.failedAt = new Date();
        post.failureReason = error.message;
        await post.save();
        
        results.push({
          id: post._id,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    return res.status(200).json({
      message: `Processed ${scheduledPosts.length} scheduled posts`,
      results
    });
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
    return res.status(500).json({ 
      message: 'Error processing scheduled posts',
      error: error.message 
    });
  }
}