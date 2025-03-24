import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongoDB from "@/backend/mongodb";
import ScheduledPost from "@/backend/ScheduledPostSchema";
import { format, differenceInMinutes } from "date-fns";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the submitted data
    const { 
      community, 
      title, 
      text, 
      scheduledDateTime, // ISO formatted date-time string
      timeZone, 
      currentClientTime, // ISO formatted current client time
      type = "text" 
    } = req.body;

    console.log(req.body, 'req.body');

    // Validate required fields
    if (!community || !title || !scheduledDateTime) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { community, title, text, scheduledDateTime }
      });
    }
    
    // For text posts, ensure text content is provided
    if (type === 'text' && !text) {
      return res.status(400).json({ 
        message: 'Text content is required for text posts',
      });
    }

    // Check if the Reddit access token is available in the session
    if (!session.accessToken) {
      return res.status(401).json({ 
        message: 'Reddit authentication required',
        error: 'No Reddit access token found in session'
      });
    }
    
    // Check if the Reddit refresh token is available in the session
    if (!session.refreshToken) {
      return res.status(401).json({ 
        message: 'Reddit refresh token required',
        error: 'No Reddit refresh token found in session'
      });
    }
    
    // Calculate time difference in minutes
    const minutesInFuture = differenceInMinutes(scheduledDateTime, currentClientTime);
    
    console.log('Client current time:', format(currentClientTime, 'PPPp'));
    console.log('Scheduled time:', format(scheduledDateTime, 'PPPp'));
    console.log('Minutes in future:', minutesInFuture);
    
    // Determine if we should post immediately or schedule
    // Post immediately if scheduled time is in the past or within 2 minutes
    const shouldPostImmediately = minutesInFuture <= 2;
    
    // If we should post immediately, send it to Reddit now
    if (shouldPostImmediately) {
      console.log('Posting to Reddit immediately...');
      
      try {
        // Construct Reddit API request for submission
        const redditApiUrl = `https://oauth.reddit.com/api/submit`;
        
        // Make the actual API call to Reddit
        const redditResponse = await fetch(redditApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'RedditScheduler/1.0.0'
          },
          body: new URLSearchParams({
            'sr': community.replace('r/', ''), // Remove 'r/' prefix if present
            'kind': 'self',                   // 'self' for text posts
            'title': title,
            'text': text,
            'api_type': 'json',
            'resubmit': 'true'
          })
        });

        const redditData = await redditResponse.json();

        if (!redditResponse.ok) {
          throw new Error(redditData.error || redditData.message || 'Failed to submit post to Reddit');
        }
        
        // Connect to MongoDB
        await connectMongoDB();
        
        const postedPost = new ScheduledPost({
          userId: session.user.id,
          community: community.replace('r/', ''),
          title,
          text,
          type,
          scheduledFor: format(scheduledDateTime, 'PPPp'), 
          userTimeZone: timeZone,
          status: 'published',
          redditPostId: redditData.json?.data?.id || null,
          redditFullname: redditData.json?.data?.name || null,
          redditAccessToken: session.accessToken,
          redditRefreshToken: session.refreshToken,
          postedAt: format(currentClientTime, 'PPPp')
        });
        
        const savedPost = await postedPost.save();

        return res.status(200).json({
          message: 'Post submitted to Reddit immediately',
          data: {
            id: savedPost._id,
            community,
            title,
            scheduledFor: format(scheduledDateTime, 'PPPp'),
            postedAt: format(currentClientTime, 'PPPp'),
            redditPostId: redditData.json?.data?.id || null,
            redditFullname: redditData.json?.data?.name || null,
            redditUrl: redditData.json?.data?.url || null
          }
        });
        
      } catch (error) {
        console.error('Error posting to Reddit:', error);
        return res.status(500).json({ 
          message: 'Error posting to Reddit',
          error: error.message 
        });
      }
    } 
    // Otherwise, schedule the post for later
    else {
      // Connect to MongoDB
      await connectMongoDB();

      console.log(format(currentClientTime, 'PPPp'), 'currentClientTime in else');
      console.log(format(scheduledDateTime, 'PPPp'), 'scheduledDateTime in else');
      
      // Create a new scheduled post
      const scheduledPost = new ScheduledPost({
        userId: session.user.id,
        community: community.replace('r/', ''), // Remove 'r/' prefix if present
        title,
        text,
        type,
        scheduledFor: format(scheduledDateTime, 'PPPp'),
        userTimeZone: timeZone, // Store the user's timezone for reference
        status: 'scheduled',
        redditAccessToken: session.accessToken,
        redditRefreshToken: session.refreshToken
      });
      
      const savedPost = await scheduledPost.save();

      return res.status(200).json({
        message: 'Post scheduled successfully',
        data: {
          id: savedPost._id,
          community,
          title,
          scheduledFor: format(scheduledDateTime, 'PPPp'),
          timeZone,
          createdAt: format(currentClientTime, 'PPPp')
        }
      });
    }

  } catch (error) {
    console.error('Error handling post request:', error);
    return res.status(500).json({ 
      message: 'Error handling post request',
      error: error.message 
    });
  }
}