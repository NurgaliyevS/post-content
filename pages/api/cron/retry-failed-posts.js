import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
import { refreshAccessToken } from "@/utils/refreshAccessToken";
import { DateTime } from "luxon";

// This endpoint will be called by Vercel Cron to retry failed posts
export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectMongoDB();
    const currentTimeUTC = DateTime.now().toUTC();
    console.log('Current server time:', currentTimeUTC);

    // Find posts that failed
    const failedPosts = await ScheduledPost.find({ status: 'failed' });
    console.log(`Found ${failedPosts.length} failed posts to retry`);

    const results = [];

    for (const post of failedPosts) {
      try {
        const userTimeZone = post.userTimeZone || 'UTC';
        const currentTimeInUserTZ = currentTimeUTC.setZone(userTimeZone);
        const scheduledDateTime = DateTime.fromJSDate(post.scheduledFor).setZone(userTimeZone);

        console.log(`Retrying failed post ${post._id} (scheduled for: ${scheduledDateTime.toISO()}, now: ${currentTimeInUserTZ.toISO()})`);

        // Always refresh token before posting to ensure it's valid
        let accessToken = post.redditAccessToken;
        try {
          const refreshResult = await refreshAccessToken(post.redditRefreshToken);
          accessToken = refreshResult.access_token;
          post.redditAccessToken = accessToken;
          if (refreshResult.refresh_token) {
            post.redditRefreshToken = refreshResult.refresh_token;
          }
          await post.save();
        } catch (refreshError) {
          console.error(`Failed to refresh token for post ${post._id}:`, refreshError);
          post.status = 'failed';
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.failureReason = 'Failed to refresh Reddit access token: ' + (refreshError.message || 'Unknown error');
          await post.save();
          results.push({ id: post._id, status: 'failed', error: refreshError.message });
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
        if (post.type === 'link' && post.url) {
          requestBody.append('url', post.url);
        }
        console.log(`Attempting to resubmit post ${post._id} to Reddit (community: r/${post.community}, type: ${post.type})`);
        const redditResponse = await fetch(redditApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Post Content/1.0.0'
          },
          body: requestBody
        });
        const contentType = redditResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Post ${post._id} failed: Reddit API returned non-JSON response (${redditResponse.status})`);
          post.status = 'failed';
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.failureReason = `Reddit API returned non-JSON response (${redditResponse.status})`;
          await post.save();
          results.push({ id: post._id, status: 'failed', error: 'Reddit API returned non-JSON response' });
          continue;
        }
        const redditData = await redditResponse.json();
        if (redditResponse.ok && redditData?.json?.data?.url) {
          post.status = 'published';
          post.publishedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.redditPostUrl = redditData.json.data.url;
          post.redditPostId = redditData.json.data.id;
          await post.save();
          results.push({ id: post._id, status: 'published', redditPostUrl: redditData.json.data.url });
          console.log(`Successfully published post ${post._id} to Reddit`);
        } else {
          post.status = 'failed';
          post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
          post.failureReason = redditData.json?.errors?.join(', ') || 'Unknown error';
          await post.save();
          results.push({ id: post._id, status: 'failed', error: redditData.json?.errors || 'Failed to publish post' });
          console.error(`Failed to publish post ${post._id}:`, redditData.json?.errors);
        }
      } catch (error) {
        console.error(`Error retrying post ${post._id}:`, error);
        const userTimeZone = post.userTimeZone || 'UTC';
        const currentTimeInUserTZ = currentTimeUTC.setZone(userTimeZone);
        post.status = 'failed';
        post.failedAt = currentTimeInUserTZ.toFormat("yyyy-MM-dd HH:mm:ss");
        post.failureReason = error.message;
        await post.save();
        results.push({ id: post._id, status: 'failed', error: error.message });
      }
    }
    return res.status(200).json({ message: `Retried ${failedPosts.length} failed posts`, results });
  } catch (error) {
    console.error('Error retrying failed posts:', error);
    return res.status(500).json({ message: 'Error retrying failed posts', error: error.message });
  }
} 