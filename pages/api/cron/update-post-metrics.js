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
        $gte: currentTimeUTC.minus({ days: 7 }).toJSDate() 
      },
      userId: '67e41eeeca8b6cf686633b6f'
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
        
        // Fetch post data from Reddit API with sr_detail parameter
        const redditResponse = await fetch(`https://oauth.reddit.com/by_id/t3_1jsxv5h?sr_detail=true`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'RedditScheduler/1.0.0'
          }
        });
        
        const redditData = await redditResponse.json();
        console.log('Full Reddit response:', redditData);

        const postData = redditData.data.children[0]?.data;

        console.log(postData, 'postData');
        
        if (!postData) {
          console.log(`No data found for post ${post.redditPostId}`);
          results.push({
            postId: post.redditPostId,
            status: 'not_found'
          });
          continue;
        }

        // Get post analytics using the /api/info endpoint with rawjson=1
        const analyticsResponse = await fetch(`https://oauth.reddit.com/api/info?id=t3_1jsxv5h&rawjson=1`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'RedditScheduler/1.0.0'
          }
        });

        const analyticsData = await analyticsResponse.json();
        console.log('Analytics data:', analyticsData);

        const analyticsPostData = analyticsData.data?.children[0]?.data;

        console.log(analyticsPostData, 'analyticsPostData');
        
        // Calculate impressions from various possible sources
        const impressions = postData?.view_count || 
                          analyticsPostData?.view_count || 
                          postData?.all_awardings?.reduce((total, award) => total + award.count, 0) || 
                          0;

        console.log('Calculated impressions:', impressions);
        
        // Create or update metrics
        const metrics = await PostMetrics.findOneAndUpdate(
          { postId: post.redditPostId },
          {
            userId: post.userId,
            title: post.title,
            community: post.community,
            impressions: impressions,
            upvotes: postData.ups,
            comments: postData.num_comments,
            postUrl: post.redditPostUrl,
            lastUpdated: currentTimeUTC.toJSDate(),
            isEarlyEmailSent: false
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