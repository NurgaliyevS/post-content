import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
import PostMetrics from "@/backend/PostMetricsSchema";
import { refreshAccessToken } from "@/utils/refreshAccessToken";
import { DateTime } from "luxon";

// This endpoint will be called by Vercel Cron
export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get current time in UTC
    const currentTimeUTC = DateTime.now().toUTC();
    
    // Find published posts from the last 7 days
    // filter by userId: 67e41eeeca8b6cf686633b6f
    const publishedPosts = await ScheduledPost.find({ 
      status: 'published',
      publishedAt: { 
        $gte: currentTimeUTC.minus({ days: 2 }).toJSDate() 
      }
    }).limit(5);
    
    console.log(`Found ${publishedPosts.length} published posts to update metrics for`);
    
    const results = [];
    
    for (const post of publishedPosts) {
      try {
        // Refresh the access token
        const refreshResult = await refreshAccessToken(post.redditRefreshToken);
        const accessToken = refreshResult.access_token;
        
        // Update the token in the database
        post.redditAccessToken = accessToken;
        if (refreshResult.refresh_token) {
          post.redditRefreshToken = refreshResult.refresh_token;
        }
        await post.save();
        
        // Fetch post data from Reddit API
        const redditResponse = await fetch(`https://oauth.reddit.com/api/info?id=t3_${post.redditPostId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'Post Content/1.0.0'
          }
        });
        
        const redditData = await redditResponse.json();

        const postData = redditData.data.children[0]?.data;
        
        if (postData) {
          console.log(post.redditPostId, "post.redditPostId that came from the database");
          // First check if metrics exist and get current values
          const existingMetrics = await PostMetrics.findOne({ postId: post.redditPostId });

          console.log(existingMetrics, "existingMetrics if it exists");
          
          // Only update if metrics don't exist
          if (!existingMetrics) {
            
            const metrics = await PostMetrics.findOneAndUpdate(
              { postId: post.redditPostId },
              {
                userId: post.userId,
                title: post.title,
                community: post.community,
                impressions: postData.view_count || 0,
                upvotes: postData.ups,
                comments: postData.num_comments,
                postUrl: post.redditPostUrl,
                lastUpdated: currentTimeUTC.toJSDate(),
                isEarlyEmailSent: false,
                upvoteRatio: postData.upvote_ratio,
                scheduledFor: post.scheduledFor,
              },
              { upsert: true, new: true }
            );
            
            results.push({
              postId: post.redditPostId,
              status: 'updated',
              metrics: {
                impressions: metrics.impressions,
                upvotes: metrics.upvotes,
                comments: metrics.comments
              }
            });
            
            console.log(`Updated metrics for post ${post.redditPostId}`);
          } else {
            console.log(`Metrics for post ${post.redditPostId} exist, skipping update`);
            results.push({
              postId: post.redditPostId,
              status: 'unchanged'
            });
          }
        } else {
          console.log(`No data found for post ${post.redditPostId}`);
          results.push({
            postId: post.redditPostId,
            status: 'not_found'
          });
        }
      } catch (error) {
        console.error(`Error updating metrics for post ${post.redditPostId}:`, error);
        results.push({
          postId: post.redditPostId,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return res.status(200).json({
      message: `Updated metrics for ${publishedPosts.length} posts`,
      results
    });
  } catch (error) {
    console.error('Error updating post metrics:', error);
    return res.status(500).json({ 
      message: 'Error updating post metrics',
      error: error.message 
    });
  }
} 