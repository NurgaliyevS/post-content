import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
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
    console.log('Current UTC time:', currentTimeUTC.toISO());
    
    // Find posts that are scheduled for now or earlier and still have 'scheduled' status
    const scheduledPosts = await ScheduledPost.find({ 
      status: 'scheduled'
    });
    
    console.log(`Found ${scheduledPosts.length} total scheduled posts`);
    
    const results = [];
    
    for (const post of scheduledPosts) {
      try {
        // Get user's timezone, default to UTC if not specified
        const userTimeZone = post.userTimeZone || 'UTC';
        
        // Convert current UTC time to user's timezone
        const currentTimeInUserTZ = currentTimeUTC.setZone(userTimeZone);
        
        // Debug log the exact scheduledFor string
        console.log('Raw scheduledFor:', {
          currentTimeInUserTZ: currentTimeInUserTZ,
          value: post.scheduledFor,
          type: typeof post.scheduledFor,
          length: post.scheduledFor?.length,
          post: post
        });
        
        // Try parsing with different formats
        const formats = [
          "MMMM d'th', yyyy 'at' h:mm aa",
          "MMMM d'th', yyyy 'at' h:mm a",
          "MMMM d'th', yyyy 'at' h:mm",
          "MMMM d, yyyy 'at' h:mm aa",
          "MMMM d, yyyy 'at' h:mm a",
          "MMMM d, yyyy 'at' h:mm"
        ];
        
        let scheduledTime = null;
        let usedFormat = null;

        console.log(post.scheduledFor, 'post.scheduledFor');
        
        for (const format of formats) {
          const parsed = DateTime.fromFormat(post.scheduledFor, format, {
            zone: userTimeZone
          });
          
          if (parsed.isValid) {
            scheduledTime = parsed;
            usedFormat = format;
            break;
          }
        }
        
        if (!scheduledTime?.isValid) {
          console.error(`Invalid scheduled time for post ${post._id}:`, {
            scheduledFor: post.scheduledFor,
            invalidReason: scheduledTime?.invalidReason,
            triedFormats: formats
          });
          continue;
        }

        console.log(`Post ${post._id}:`, {
          userTimeZone,
          currentTimeInUserTZ: currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss"),
          scheduledTime: scheduledTime.toFormat("yyyy-MM-dd HH:mm:ss"),
          originalScheduledFor: post.scheduledFor,
          usedFormat
        });

        // Compare times in the same timezone (user's timezone)
        if (scheduledTime > currentTimeInUserTZ) {
          console.log(`Skipping post ${post._id} - scheduled for future in user's timezone`);
          continue;
        }

        // The access token might have expired, refresh it
        let accessToken = post.redditAccessToken;
        
        // Check if token needs refresh (tokens last 1 hour)
        const oneHourAgo = currentTimeUTC.minus({ hours: 1 });
        if (DateTime.fromJSDate(post.createdAt) < oneHourAgo) {
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
          post.publishedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
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
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
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
        post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
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