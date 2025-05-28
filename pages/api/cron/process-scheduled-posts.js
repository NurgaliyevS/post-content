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
    console.log('Current server time:', currentTimeUTC);
    
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
        
        // Convert scheduledFor to DateTime for comparison
        const scheduledDateTime = DateTime.fromJSDate(post.scheduledFor).setZone(userTimeZone);

        // Debug log the exact scheduledFor string
        console.log('Raw scheduledFor:', {
          currentTimeInUserTZ: currentTimeInUserTZ,
          scheduledFor: post.scheduledFor,
          scheduledDateTime: scheduledDateTime,
          comparison: scheduledDateTime > currentTimeInUserTZ
        });

        // Compare times in the same timezone (user's timezone)
        if (scheduledDateTime > currentTimeInUserTZ) {
          console.log(`Skipped post ${post._id} - scheduled for future in user's timezone (scheduled for: ${scheduledDateTime.toISO()}, now: ${currentTimeInUserTZ.toISO()})`);
          continue;
        }

        console.log(`Processing post ${post._id} - ready to submit (scheduled for: ${scheduledDateTime.toISO()}, now: ${currentTimeInUserTZ.toISO()})`);
        // The access token might have expired, refresh it
        let accessToken = post.redditAccessToken;
        
        // Always refresh token before posting to ensure it's valid
        console.log(`Refreshing token for post ${post._id}`);
        try {
          const refreshResult = await refreshAccessToken(post.redditRefreshToken);
          console.log('Refresh result:', refreshResult);
          console.log('Access token:', accessToken);
          accessToken = refreshResult.access_token;
          console.log('New access token:', accessToken);
          
          // Update the token in the database
          post.redditAccessToken = accessToken;
          if (refreshResult.refresh_token) {
            post.redditRefreshToken = refreshResult.refresh_token;
          }
          await post.save();
        } catch (refreshError) {
          console.error(`Failed to refresh token for post ${post._id}:`, refreshError);
          post.status = 'failed';
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.failureReason = 'Failed to refresh Reddit access token';
          await post.save();
          continue;
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

        if (post?.flairId) {
          requestBody.append('flair_id', post.flairId);
        }
        
        console.log(`Attempting to submit post ${post._id} to Reddit (community: r/${post.community}, type: ${post.type})`);
        
        const redditResponse = await fetch(redditApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Post Content/1.0.0'
          },
          body: requestBody
        });
        
        // Handle non-JSON responses
        const contentType = redditResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Post ${post._id} failed: Reddit API returned non-JSON response (${redditResponse.status})`);
          post.status = 'failed';
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.failureReason = `Reddit API returned non-JSON response (${redditResponse.status})`;
          await post.save();
          continue;
        }

        const redditData = await redditResponse.json();
        console.log('Reddit API Response:', redditData);

        if (redditResponse.status === 401) {
          console.log(`Token expired for post ${post._id}, attempting refresh and retry`);
          try {
            const refreshResult = await refreshAccessToken(post.redditRefreshToken);
            accessToken = refreshResult.access_token;
            post.redditAccessToken = accessToken;
            if (refreshResult.refresh_token) {
              post.redditRefreshToken = refreshResult.refresh_token;
            }
            await post.save();
            
            // Retry the post with new token
            const retryResponse = await fetch(redditApiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Post Content/1.0.0'
              },
              body: requestBody
            });
            
            const retryData = await retryResponse.json();
            if (retryResponse.ok && retryData?.json?.data?.url) {
              post.status = 'published';
              post.publishedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
              post.redditPostUrl = retryData.json.data.url;
              post.redditPostId = retryData.json.data.id;
              await post.save();
              
              results.push({
                id: post._id,
                status: 'published',
                redditPostUrl: retryData.json.data.url
              });
              
              console.log(`Successfully published post ${post._id} to Reddit after token refresh`);
              continue;
            }
          } catch (retryError) {
            console.error(`Failed to retry post ${post._id} after token refresh:`, retryError);
          }
        }

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
          console.error(`Post ${post._id} failed to publish, setting status to failed. Reddit API errors:`, redditData.json?.errors);
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
        console.error(`Error publishing post ${post._id}, setting status to failed:`, error);
        const userTimeZone = post.userTimeZone || 'UTC';
        const currentTimeInUserTZ = currentTimeUTC.setZone(userTimeZone);
        
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